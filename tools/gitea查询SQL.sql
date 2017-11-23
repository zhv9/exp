# 查询所有issue及其里程碑和标签
SELECT
	i.`name` AS 'issue名称',
	cu.`name` AS '创建人',
	r.lower_name AS '仓库名',
	m.`name` AS '里程碑',
	l.`name` AS '标签',
	au.`name` AS '指派人'
FROM
	(
		issue i
		LEFT JOIN milestone m ON i.milestone_id = m.id
		LEFT JOIN repository r ON i.repo_id = r.id
		LEFT JOIN `user` cu ON i.poster_id = cu.id
		LEFT JOIN `user` au ON i.assignee_id = au.id
		INNER JOIN issue_label il ON i.id = il.issue_id
		INNER JOIN label l ON il.label_id = l.id
	);

# 查询所有issue及其里程碑和标签,并将标签合并(用逗号分隔)，使用里程碑排序
SELECT
	i.`name` AS 'issue名称',
	r.lower_name AS '仓库名',
	m.`name` AS '里程碑',
	GROUP_CONCAT(l.`name` SEPARATOR ',') AS '标签'
FROM
	(
		issue i
		INNER JOIN milestone m ON i.milestone_id = m.id
		LEFT JOIN repository r ON i.repo_id = r.id
		LEFT JOIN issue_label il ON i.id = il.issue_id
		LEFT JOIN label l ON il.label_id = l.id
	)
GROUP BY
	i.`name`
ORDER BY
	m.`name`;

# 选择标签是'类型/BUG'的issue
SELECT
	i.`name` AS 'issue名称',
	r.lower_name AS '仓库名',
	m.`name` AS '里程碑',
	l.`name` AS '标签'
FROM
	(
		issue i
		LEFT JOIN milestone m ON i.milestone_id = m.id
		LEFT JOIN repository r ON i.repo_id = r.id
		INNER JOIN issue_label il ON i.id = il.issue_id
		INNER JOIN label l ON il.label_id = l.id
	)
WHERE
	(
		r.lower_name = 'assert'
		AND r.lower_name = 'assert'
		AND l.`name` = '类型/BUG'
	);

# 选择标签是'类型/BUG'的issue，并且issue的标题包含'不合适'(%代表任意字符)
SELECT
	i.`name` AS 'issue名称',
	r.lower_name AS '仓库名',
	m.`name` AS '里程碑',
	l.`name` AS '标签'
FROM
	(
		issue i
		LEFT JOIN milestone m ON i.milestone_id = m.id
		LEFT JOIN repository r ON i.repo_id = r.id
		INNER JOIN issue_label il ON i.id = il.issue_id
		INNER JOIN label l ON il.label_id = l.id
	)
WHERE
	(
		l.`name` = '类型/BUG'
		AND r.lower_name = 'assert'
		AND i.`name` LIKE '%不合适%'
	);

