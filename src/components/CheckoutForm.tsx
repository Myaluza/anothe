import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import type { CustomerDetails, FormErrors, Fulfilment } from "../types/customer";
import { FIELD_LIMITS, validateCheckout } from "../utils/validateCheckout";
import { useCart } from "../context/useCart";
import { buildOrderMessage } from "../utils/buildOrderMessage";
import { cartTotal } from "../utils/cartTotals";
import { deliveryFee } from "../utils/delivery";
import { formatCurrency } from "../utils/formatCurrency";
import { createOrderRef } from "../utils/createOrderRef";
import { saveLastOrder } from "../utils/lastOrder";
import { COLLECTION, DELIVERY_AREAS, WHATSAPP_NUMBER } from "../config";

const inputClass = 'w-full border border-cocoa rounded-lg px-3 py-2 bg-white'
const labelClass = 'block text-sm text-cocoa mb-1'

// Checked in this order so focus goes to the first problem on the page.
const FIELD_ORDER: (keyof FormErrors)[] = ['name', 'phone', 'areaId', 'address', 'note']

// Links a field to its error message so screen readers announce it.
function errorProps(errors: FormErrors, field: keyof FormErrors) {
    return errors[field]
        ? { 'aria-invalid': true, 'aria-describedby': `${field}-error` }
        : {}
}

function FieldError({ errors, field }: { errors: FormErrors; field: keyof FormErrors }) {
    return errors[field] ? <p id={`${field}-error`} className="text-sm text-red-700">{errors[field]}</p> : null
}

export default function CheckoutForm() {
  const [details, setDetails] = useState<CustomerDetails>({
    name: "",
    phone: "",
    fulfilment: "delivery",
    areaId: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({})
  const { items, dispatch } = useCart()
  const navigate = useNavigate()

  const subtotal = cartTotal(items)
  const fee = deliveryFee(details)
  const isDelivery = details.fulfilment === 'delivery'

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const {name, value} = e.target
    setDetails(prev => ({...prev, [name]: value}))
  }

  function setFulfilment(fulfilment: Fulfilment) {
    setDetails(prev => ({ ...prev, fulfilment }))
    setErrors(prev => ({ ...prev, areaId: undefined, address: undefined }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const newErrors = validateCheckout(details)
    setErrors(newErrors)

    const firstInvalid = FIELD_ORDER.find(field => newErrors[field])
    if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus()
        return
    }

    const ref = createOrderRef()
    const message = buildOrderMessage(items, details, ref)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

    saveLastOrder({ ref, name: details.name.trim(), message, totalCents: subtotal + fee, whatsappUrl })
    // Open WhatsApp while still inside the click handler so popup blockers allow it.
    window.open(whatsappUrl, '_blank', 'noopener')
    dispatch({ type: 'CLEAR' })
    navigate('/order/confirmed')
  }

  const optionClass = (active: boolean) =>
    `flex-1 text-center cursor-pointer rounded-lg border px-4 py-3 ${active ? 'border-espresso bg-espresso text-cream' : 'border-cocoa/70 text-cocoa hover:border-gold-light'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
            <label className={labelClass} htmlFor='name'>Name</label>
            <input id='name' name='name' autoComplete='name' maxLength={FIELD_LIMITS.name} className={inputClass} value={details.name} onChange={handleChange} {...errorProps(errors, 'name')} />
            <FieldError errors={errors} field='name' />
        </div>
        <div>
            <label className={labelClass} htmlFor='phone'>Phone</label>
            <input
                id='phone'
                name='phone'
                type='tel'
                inputMode='tel'
                autoComplete='tel'
                maxLength={FIELD_LIMITS.phone}
                placeholder='082 123 4567'
                className={inputClass}
                value={details.phone}
                onChange={handleChange}
                {...errorProps(errors, 'phone')}
            />
            <FieldError errors={errors} field='phone' />
        </div>

        {COLLECTION.enabled && (
            <fieldset>
                <legend className={labelClass}>How would you like to get your order?</legend>
                <div className="flex gap-3">
                    {(['delivery', 'collection'] as const).map(option => (
                        <label key={option} className={optionClass(details.fulfilment === option)}>
                            <input
                                type="radio"
                                name="fulfilment"
                                value={option}
                                className="sr-only"
                                checked={details.fulfilment === option}
                                onChange={() => setFulfilment(option)}
                            />
                            {option === 'delivery' ? 'Delivery' : 'Collection (free)'}
                        </label>
                    ))}
                </div>
            </fieldset>
        )}

        {isDelivery ? (
            <>
                <div>
                    <label className={labelClass} htmlFor='areaId'>Delivery area</label>
                    <select id='areaId' name='areaId' className={inputClass} value={details.areaId} onChange={handleChange} {...errorProps(errors, 'areaId')}>
                        <option value="">Choose your area</option>
                        {DELIVERY_AREAS.map(area => (
                            <option key={area.id} value={area.id}>
                                {area.name} — {formatCurrency(area.feeCents)}
                            </option>
                        ))}
                    </select>
                    <FieldError errors={errors} field='areaId' />
                </div>
                <div>
                    <label className={labelClass} htmlFor='address'>Street address</label>
                    <input
                        id='address'
                        name='address'
                        autoComplete='street-address'
                        maxLength={FIELD_LIMITS.address}
                        placeholder='House number, street, complex/unit'
                        className={inputClass}
                        value={details.address}
                        onChange={handleChange}
                        {...errorProps(errors, 'address')}
                    />
                    <FieldError errors={errors} field='address' />
                </div>
            </>
        ) : (
            <div className="rounded-lg bg-white px-4 py-3 text-sm text-cocoa">
                <p className="font-semibold">Collect from</p>
                <p>{COLLECTION.address}</p>
                <p className="text-cocoa/80">{COLLECTION.note}</p>
            </div>
        )}

        <div>
            <label className={labelClass} htmlFor='note'>Notes</label>
            <textarea id='note' name='note' className={inputClass} rows={4} maxLength={FIELD_LIMITS.note} value={details.note ?? ""} onChange={handleChange} {...errorProps(errors, 'note')}></textarea>
            <FieldError errors={errors} field='note' />
        </div>

        <dl className="rounded-lg bg-white px-4 py-3 space-y-1 text-cocoa">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between">
                <dt>{isDelivery ? 'Delivery' : 'Collection'}</dt>
                <dd>{isDelivery ? (details.areaId ? formatCurrency(fee) : 'Choose an area') : 'Free'}</dd>
            </div>
            <div className="flex justify-between text-lg font-semibold text-espresso border-t border-gold-light/40 pt-1">
                <dt>Total</dt><dd>{formatCurrency(subtotal + fee)}</dd>
            </div>
        </dl>

        <button className="w-full bg-gold text-white py-3 rounded-lg text-lg font-semibold hover:bg-espresso" type="submit">Order on WhatsApp</button>
    </form>
  );
}
