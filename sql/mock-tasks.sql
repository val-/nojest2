
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
