import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import type { CustomerDetails, FormErrors, Fulfilment } from "../types/customer";
import { validateCheckout } from "../utils/validateCheckout";
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

    if (Object.keys(newErrors).length > 0) {
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
    `flex-1 text-center cursor-pointer rounded-lg border px-4 py-3 ${active ? 'border-espresso bg-espresso text-cream' : 'border-cocoa/40 text-cocoa hover:border-gold'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
            <label className={labelClass} htmlFor='name'>Name</label>
            <input id='name' name='name' autoComplete='name' className={inputClass} value={details.name} onChange={handleChange} />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
            <label className={labelClass} htmlFor='phone'>Phone</label>
            <input
                id='phone'
                name='phone'
                type='tel'
                inputMode='tel'
                autoComplete='tel'
                placeholder='082 123 4567'
                className={inputClass}
                value={details.phone}
                onChange={handleChange}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
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
                    <select id='areaId' name='areaId' className={inputClass} value={details.areaId} onChange={handleChange}>
                        <option value="">Choose your area</option>
                        {DELIVERY_AREAS.map(area => (
                            <option key={area.id} value={area.id}>
                                {area.name} — {formatCurrency(area.feeCents)}
                            </option>
                        ))}
                    </select>
                    {errors.areaId && <p className="text-sm text-red-600">{errors.areaId}</p>}
                </div>
                <div>
                    <label className={labelClass} htmlFor='address'>Street address</label>
                    <input
                        id='address'
                        name='address'
                        autoComplete='street-address'
                        placeholder='House number, street, complex/unit'
                        className={inputClass}
                        value={details.address}
                        onChange={handleChange}
                    />
                    {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
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
            <textarea id='note' name='note' className={inputClass} rows={4} value={details.note ?? ""} onChange={handleChange}></textarea>
        </div>

        <dl className="rounded-lg bg-white px-4 py-3 space-y-1 text-cocoa">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between">
                <dt>{isDelivery ? 'Delivery' : 'Collection'}</dt>
                <dd>{isDelivery ? (details.areaId ? formatCurrency(fee) : 'Choose an area') : 'Free'}</dd>
            </div>
            <div className="flex justify-between text-lg font-semibold text-espresso border-t border-gold/40 pt-1">
                <dt>Total</dt><dd>{formatCurrency(subtotal + fee)}</dd>
            </div>
        </dl>

        <button className="w-full bg-gold text-white py-3 rounded-lg text-lg font-semibold hover:bg-espresso" type="submit">Order on WhatsApp</button>
    </form>
  );
}
