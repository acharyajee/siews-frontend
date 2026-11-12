# AviaSafe SIEWS — Public Executive Landing Page & Client Portal

Official public frontend and executive showcase for the **Integrated Aviation Safety Intelligence and Early Warning System (SIEWS)**, operationalizing **ICAO Annex 19**, **Doc 9859 (Safety Management Manual)**, **Doc 10159 (Manual on Safety Intelligence)**, and **Annex 6 (FRMS)**.

## Key Capabilities
- **Governed SDCPS & Just-Culture:** Multi-tenant reporting, Quality Gate validation, and Appendix 3 privacy protections.
- **Causal NLP & Statistical Surveillance:** Automated HFACS/MEDA taxonomy tagging, Safety Officer adjudication queues, and SPC ($\mu \pm 3\sigma$) control charts.
- **Probabilistic Proofs & GSN Assurance:** Monte Carlo risk dispersion, One-At-A-Time (OAT) barrier sensitivity, 4-state Markov failure exposure, and dynamic GSN assurance trees.
- **Bio-Mathematical FRMS & Predictive Forecasting:** Three-Process SAFTE crew alertness modeling, WOCL/STOL duty limits, Holt-Poisson 30/60/90-day exceedance forecasting, and State Regulator ADREP/ECCAIRS SHA-256 gateway sync.

## Local Development & Deployment
```bash
# Install dependencies
npm --prefix frontend install

# Run Vite development server
npm --prefix frontend run dev

# Build production bundle
npm --prefix frontend run build