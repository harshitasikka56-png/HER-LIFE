HER LIFE — SYNTHETIC DEMONSTRATION DATASET
============================================

IMPORTANT
---------
All records in this package are algorithmically generated synthetic examples.
They are NOT real patient data, NOT clinically validated, and must NOT be used
to make medical decisions or to claim real-world prediction accuracy.

Package files
------------
1. users.csv
   One row per synthetic user; life stage, age, reported cycle regularity.

2. daily_model_dataset.csv
   Main machine-learning table. One row per user per day for 365 days.
   Includes cycle-related estimates, lifestyle variables, symptom severity,
   optional synthetic fertility observations, and next-day symptom labels.

3. cycles.csv
   Synthetic period start/end dates, bleeding duration, flow category, and
   cycle length when the next period start is available.

4. symptom_events_long.csv
   Long-format symptom event table: one row per symptom present on a date.

5. fertility_logs.csv
   Sparse synthetic basal temperature, LH test and cervical mucus observations.

Life stages represented
-----------------------
teen_menarche, reproductive, pregnancy_postpartum, perimenopause, menopause.

Suggested project use
---------------------
- App UI demonstration and end-to-end pipeline testing.
- Practicing pandas data cleaning and exploratory data analysis.
- Prototyping a baseline next-day symptom classifier.
- Testing data validation, missing-value handling and alert logic.

Do not use this dataset to establish medical effectiveness.
The synthetic relationships are intentionally simplified and do not reflect
the full biological variation of menstrual cycles or menopause.

Modeling cautions
-----------------
- Split train/test data by user (GroupShuffleSplit or GroupKFold) to reduce
  leakage between the same user's daily records.
- For realistic prospective evaluation, use chronological splits as well.
- Exclude identifiers, future outcomes, and post-outcome columns from features.
- The estimated ovulation fields are generated assumptions, not ground truth.
- Next-day labels are derived from synthetic future records and are suitable
  only for demonstrating a pipeline.
- Never treat the cycle-phase or fertility flags as confirmed physiological
  measurements.
