import { useState } from 'react'

type CartQuantityInputProps = {
  quantity: number
  stock: number
  onChange: (quantity: number) => void
}

/** CartQuantityInput: permite borrar y reescribir la cantidad; nunca supera el stock ni baja de 1. */
export const CartQuantityInput = ({ quantity, stock, onChange }: CartQuantityInputProps) => {
  const [draft, setDraft] = useState<string | null>(null)

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
