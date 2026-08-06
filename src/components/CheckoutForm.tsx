import { useState, type ChangeEvent, type FormEvent } from "react";
import type { CustomerDetails } from "../types/customer";
import type { FormErrors } from "../types/customer";
import { validateCheckout } from "../utils/validateCheckout";
import { useCart } from "../context/CartContext";
import { buildOrderMessage } from "../utils/buildOrderMessage";

const WHATSAPP_NUMBER = '27821234567'

export default function CheckoutForm() {
  const [details, setDetails] = useState<CustomerDetails>({
    name: "",
    phone: "",
    area: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({})
  const { items } = useCart()

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const {name, value} = e.target
    setDetails(prev => ({...prev, [name]: value}))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    const newErrors = validateCheckout(details)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
        return
    }

    const message = buildOrderMessage(items, details)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className='block text-sm text-cocoa mb-1' htmlFor='name'>
                Name
            </label>
            <input
                id='name'
                name='name'
                className='w-full border border-cocoa rounded-lg px-3 py-2'
                value={details.name}
                onChange={handleChange}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
            <label className='block text-sm text-cocoa mb-1' htmlFor='phone'>
                Phone
            </label>
            <input
                id='phone'
                name='phone'
                className='w-full border border-cocoa rounded-lg px-3 py-2'
                value={details.phone}
                onChange={handleChange}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>
        <div>
            <label className='block text-sm text-cocoa mb-1' htmlFor='area'>
                Area
            </label>
            <input
                id='area'
                name='area'
                className='w-full border border-cocoa rounded-lg px-3 py-2'
                value={details.area}
                onChange={handleChange}
            />
            {errors.area && <p className="text-sm text-red-600">{errors.area}</p>}
        </div>
        <div>
            <label className='block text-sm text-cocoa mb-1' htmlFor='note'>
                Notes
            </label>
            <textarea
                id='note'
                name='note'
                className='w-full border border-cocoa rounded-lg px-3 py-2'
                rows={4}
                value={details.note ?? ""}
                onChange={handleChange}
            ></textarea>
        </div>
        <button className="w-full bg-gold text-white py-3 rounded-lg text-lg font-semibold hover:bg-espresso" type="submit">Order on WhatsApp</button>
    </form>
  );
}
