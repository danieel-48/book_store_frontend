// CartQuantityInput: controla la cantidad de libros en el carrito sin exceder el stock · HU-06 ventas POS
// Props: quantity (cantidad actual), stock (existencia disponible), onChange (callback de actualización al padre)
import { useState } from 'react'

type CartQuantityInputProps = {
  quantity: number
  stock: number
  onChange: (quantity: number) => void
}

export const CartQuantityInput = ({ quantity, stock, onChange }: CartQuantityInputProps) => {
  const [draft, setDraft] = useState<string | null>(null) // estado: texto temporal mientras el usuario digita

  // Valida que el valor ingresado sea numérico, al menos 1 y no supere el stock (HU-06)
  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '')

    if (!digits) {
      setDraft('')
      return
    }

    const next = Math.max(1, Math.min(Number(digits), stock))
    setDraft(String(next))
    onChange(next)
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label={`Cantidad (máximo ${stock})`}
      className="h-7 w-16 rounded-lg border border-slate-300 bg-slate-50 px-2 text-sm text-slate-800"
      value={draft ?? String(quantity)}
      onChange={(event) => handleChange(event.target.value)}
      onBlur={() => setDraft(null)}
    />
  )
}
