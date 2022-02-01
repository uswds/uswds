import data from "./content/usa-step-indicator.json";

export const Steps = data.steps;
export const Count = "count";

// iterate through step items
for (let s = 0; s < Steps.length; s += 1) {
    const stepInfo = Steps[s];
    const stepNumber = s + 1;
    const stepStatus = stepInfo.status;
    const stepLabel = stepInfo.label;
    console.log(`Step number: ${stepNumber} ${stepStatus} ${stepLabel}`);
}
