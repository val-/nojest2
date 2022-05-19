
-- FILLIN NOJEST APP TASKS

INSERT INTO nj_task(
  title,
  description,
  ject_id,
  task_author_id,
  contractor_id,
  deadline,
  parent_id,
  target_version_id
)
VALUES
(
  'A task example title',
  'A task example description',
  1,
  1,
  2,
  TIMESTAMP '2011-05-23 15:36:38',
  null,
  null
),
(
  'B task example title',
  'B task example description',
  1,
  1,
  2,
  TIMESTAMP '2011-05-23 15:36:38',
  1,
  null
),
(
  'C task example title',
  'C task example description',
  2,
  3,
  4,
  TIMESTAMP '2011-05-23 15:36:38',
  null,
  null
),
(
  'D task example title',
  'D task example description',
  2,
  3,
  4,
  TIMESTAMP '2011-05-23 15:36:38',
  3,
  null
),
(
  'E task example title',
  'E task example description',
  2,
  3,
  4,
  TIMESTAMP '2011-05-23 15:36:38',
  4,
  null
);



-- FILLIN NOJEST APP TASKS HISTORY

INSERT INTO nj_task_history(
  task_id,
  date_time,
  status
)
VALUES
(
  1,
  TIMESTAMP '2011-07-23 15:36:38',
  'OPENED'
),
(
  2,
  TIMESTAMP '2011-05-16 15:36:38',
  'OPENED'
),
(
  3,
  TIMESTAMP '2011-05-15 18:36:38',
  'OPENED'
),
(
  4,
  TIMESTAMP '2011-05-03 15:36:38',
  'OPENED'
),
(
  5,
  TIMESTAMP '2011-09-23 15:36:38',
  'OPENED'
);
