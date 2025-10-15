# Business Requirements Specification (BRS) - Convergence Platform

**Version:** 1.0  
**Date:** January 2025  
**Scope:** National Civic Intelligence Platform for Morocco  
**Status:** Approved  

---

## 1. Business Vision

To establish *Convergence*, a national civic intelligence platform that:

* Ensures **transparency and accountability** in Moroccan public administration.
* Provides **citizens** access to budget data, laws, rights, and government structure.
* Empowers **institutions** to measure trust, service quality, and efficiency.
* Serves as a **public governance observatory** integrating AI, data analytics, and feedback mechanisms.

---

## 2. Core Business Objectives

| Objective                              | Description                                                                                   | Key KPI                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Transparency**                       | Publish official budget, spending, and laws in accessible form                                | % of government entities with open data integrated |
| **Citizen Participation**              | Allow reviews and ratings of officials, ministries, and services                              | Number of verified citizen interactions per month  |
| **Legal Awareness**                    | AI-assisted Q&A for understanding current laws                                                | Avg. legal questions answered / day                |
| **Education & Rights Awareness**       | Inform citizens of rights & duties through curated content                                    | Engagement rate with awareness content             |
| **Institutional Performance Tracking** | Score and visualize institutional efficiency based on citizen feedback and budget utilization | Institutional trust score per region / year        |
| **Accountability**                     | Detect anomalies or discrepancies in budget execution vs. approved plans                      | % of anomalies flagged by AI reports               |

---

## 3. Key Business Domains (Functional Modules)

| Domain                   | Description                                                       | Example Data Source                           |
| ------------------------ | ----------------------------------------------------------------- | --------------------------------------------- |
| **Budget & Economics**   | Public budgets, spending, contracts, financial reports            | Ministry of Finance, TGR                      |
| **Government Hierarchy** | Regions → Provinces → Communes → Institutions → Officials         | Official Gazette, HCP                         |
| **Legal Repository**     | Laws, decrees, regulations, searchable with AI                    | BO (Bulletin Officiel)                        |
| **Public Reviews**       | Citizen feedback on officials, institutions, services             | Convergence platform users                    |
| **Civic Awareness**      | Educational content on rights, duties, and governance             | Government publications, NGOs                 |
| **AI Knowledge Engine**  | Intelligent assistant trained on laws, budget data, and structure | Integrated LLM fine-tuned on Moroccan sources |

---

## 4. Business Processes

### 4.1 Budget Transparency Workflow

1. Ingest official budget and spending data (PDF, Excel, API from finance.gov.ma).
2. Normalize by region, institution, and program.
3. Visualize through charts and dashboards for citizens.
4. Allow feedback and flagging of inconsistencies.

### 4.2 Government Hierarchy Management

1. Central admin loads or updates national structure (regions, provinces, communes).
2. Associate institutions, officials, and roles.
3. Update real-time from official sources (via scraping or API).

### 4.3 Law Publication and AI Q&A

1. Extract laws and decrees from the *Bulletin Officiel*.
2. Store in structured tables (Law → Article → Keywords).
3. Embed AI assistant for question answering and search.

### 4.4 Social Awareness & Education

1. Publish curated articles, infographics, and rights awareness videos.
2. Measure engagement through click metrics.
3. Adapt content dynamically based on trending citizen questions.

### 4.5 Citizen Review Process

1. Citizen selects an institution or official.
2. Submits rating + comment.
3. Moderation system validates input.
4. Dashboard updates the trust score.

---

## 5. System Actors & Roles

| Role                          | Responsibilities                                   |
| ----------------------------- | -------------------------------------------------- |
| **Citizen User**              | Access budgets, laws, reviews; submit feedback.    |
| **Moderator**                 | Approve reviews, manage reported content.          |
| **Institution Admin**         | Update official data, view performance dashboards. |
| **Super Administrator (Gov)** | Oversee data ingestion, system settings.           |
| **AI Assistant**              | Respond to legal and policy queries.               |

---

## 6. KPIs & Success Metrics

| Domain        | KPI                                                         | Target                       |
| ------------- | ----------------------------------------------------------- | ---------------------------- |
| Budget        | Number of ministries with published transparent budget data | 100% of central institutions |
| Participation | Monthly active users                                        | >100K users in 1 year        |
| Legal         | Accuracy of AI legal responses                              | >90% verified accuracy       |
| Reviews       | Verified feedback to total feedback ratio                   | >80%                         |
| Awareness     | Engagement on civic education content                       | >70% read-through rate       |

---

## 7. Risk Management

| Risk                      | Mitigation                                       |
| ------------------------- | ------------------------------------------------ |
| **Defamation in reviews** | NLP moderation + legal disclaimer enforcement    |
| **Data authenticity**     | Link every dataset to its public source          |
| **AI misinformation**     | Restrict model to verified law & finance corpora |
| **Regional bias**         | Balance data visualization and sampling          |
| **Scalability**           | Modular microservices with versioned APIs        |

---

## 8. Technical Dependencies

| Category       | Tool                    | Role                           |
| -------------- | ----------------------- | ------------------------------ |
| Backend        | FastAPI (Python)        | REST API core                  |
| Database       | SQL Server              | Enterprise-grade relational DB |
| Frontend       | React + Tailwind        | UX layer                       |
| AI Layer       | LangChain + local model | Legal and budget Q&A           |
| Data Ingestion | Python ETL scripts      | Load public budgets, laws      |
| Hosting        | Azure / On-prem hybrid  | Future deployment              |
| Authentication | JWT + OAuth2            | Secure multi-role access       |

---

## 9. Integration Points (Future APIs)

* **Finance.gov.ma datasets** (for official budget CSVs)
* **Bulletin Officiel RSS / PDFs** (for law ingestion)
* **HCP.gov.ma** (hierarchical / geographic data)
* **Public feedback analytics** (Power BI or in-house dashboards)

---

## 10. Expected Outcomes

* National citizens platform for **transparency, trust, and education**.
* Data-driven ranking of institutions and officials.
* Legal and civic education integrated with **AI reasoning**.
* Foundation for future **Moroccan Governance Index** (MGI).

---

## 11. Success Criteria

### Short-term (6 months)
- Platform operational with core modules
- 10,000+ registered users
- 5 ministries with transparent budget data
- AI legal Q&A with 85%+ accuracy

### Medium-term (1 year)
- 100,000+ active users
- All central ministries integrated
- Regional expansion to 3 regions
- Advanced analytics and reporting

### Long-term (2+ years)
- National coverage across all regions
- Mobile applications
- Real-time government API integration
- International recognition as transparency model

---

## 12. Compliance & Legal Framework

* **Data Protection:** Compliance with Moroccan data protection laws
* **Public Records:** Adherence to transparency and access to information laws
* **Content Moderation:** Legal framework for user-generated content
* **AI Ethics:** Guidelines for AI-generated legal advice and disclaimers
* **Accessibility:** Compliance with web accessibility standards

---

## 13. Stakeholder Engagement

### Primary Stakeholders
- **Citizens:** End users seeking transparency and information
- **Government Institutions:** Data providers and performance subjects
- **Civil Society:** NGOs and transparency advocates
- **Media:** Journalists and researchers

### Engagement Strategy
- Regular feedback collection and user testing
- Quarterly stakeholder meetings
- Public consultation on new features
- Transparent reporting on platform usage and impact

---

**Document Control:**
- **Author:** Convergence Platform Team
- **Review Cycle:** Quarterly
- **Next Review:** April 2025
- **Approval:** Pending final stakeholder sign-off
