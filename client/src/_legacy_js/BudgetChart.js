import { jsx as _jsx } from "react/jsx-runtime";
export const BudgetChart = ({ data }) => {
    if (!data)
        return null;
    // Simple fallback: embed OpenSpending treemap for demo dataset
    return (_jsx("iframe", { src: "https://openspending.org/embed/chart?dataset=cofog-example&view=treemap", className: "w-full h-[600px] rounded-lg shadow-lg border", title: "OpenSpending Treemap" }));
};
export default BudgetChart;
