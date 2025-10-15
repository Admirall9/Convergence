import React from 'react'

type Props = {
  data: any
}

export const BudgetChart: React.FC<Props> = ({ data }) => {
  if (!data) return null

  // Simple fallback: embed OpenSpending treemap for demo dataset
  return (
    <iframe
      src="https://openspending.org/embed/chart?dataset=cofog-example&view=treemap"
      className="w-full h-[600px] rounded-lg shadow-lg border"
      title="OpenSpending Treemap"
    />
  )
}

export default BudgetChart


