# 查询所有issue及其里程碑和标签和其他相关信息
SELECT
	r.lower_name AS '仓库名',
    i.`index` AS 'index',
	i.`name` AS 'issue名称',
	cu.`name` AS '创建人',
	m.`name` AS '里程碑',
	au.`name` AS '指派人',
	l.`name` AS '标签',
	i.is_closed AS '是否关闭',
	i.num_comments AS '评论数量',
    FROM_UNIXTIME(i.created_unix) AS '创建时间',
    FROM_UNIXTIME(i.updated_unix) AS '更新时间',
    FROM_UNIXTIME(c.updated_unix) AS '关闭时间'
FROM
	(
		issue i
        LEFT JOIN (SELECT * FROM `comment` c WHERE type = 2 GROUP BY issue_id ORDER BY issue_id DESC) c ON c.issue_id = i.id
		LEFT JOIN milestone m ON i.milestone_id = m.id
		LEFT JOIN repository r ON i.repo_id = r.id
		LEFT JOIN `user` cu ON i.poster_id = cu.id
		LEFT JOIN `user` au ON i.assignee_id = au.id
		INNER JOIN issue_label il ON i.id = il.issue_id
		INNER JOIN label l ON il.label_id = l.id
	);

# 查询所有issue及其里程碑和标签,并将标签合并(用逗号分隔)，使用里程碑排序
SELECT
	r.lower_name AS '仓库名',
    i.`index` AS 'index',
	i.`name` AS 'issue名称',
	cu.`name` AS '创建人',
	m.`name` AS '里程碑',
	au.`name` AS '指派人',
	GROUP_CONCAT(l.`name` SEPARATOR ',') AS '标签',
	i.is_closed AS '是否关闭',
	i.num_comments AS '评论数量',
    FROM_UNIXTIME(i.created_unix) AS '创建时间',
    FROM_UNIXTIME(i.updated_unix) AS '更新时间',
    FROM_UNIXTIME(c.updated_unix) AS '关闭时间'
FROM
	(
		issue i
        LEFT JOIN (SELECT * FROM `comment` c WHERE type = 2 GROUP BY issue_id ORDER BY issue_id DESC) c ON c.issue_id = i.id
		LEFT JOIN milestone m ON i.milestone_id = m.id
		LEFT JOIN repository r ON i.repo_id = r.id
		LEFT JOIN `user` cu ON i.poster_id = cu.id
		LEFT JOIN `user` au ON i.assignee_id = au.id
		INNER JOIN issue_label il ON i.id = il.issue_id
		INNER JOIN label l ON il.label_id = l.id
	)
GROUP BY
	i.`name`
ORDER BY
	m.`name`;

# 选择标签是'类型/BUG'的issue
SELECT
	r.lower_name AS '仓库名',
    i.`index` AS 'index',
	i.`name` AS 'issue名称',
	cu.`name` AS '创建人',
	m.`name` AS '里程碑',
	au.`name` AS '指派人',
	l.`name` AS '标签',
	i.is_closed AS '是否关闭',
	i.num_comments AS '评论数量',
    FROM_UNIXTIME(i.created_unix) AS '创建时间',
    FROM_UNIXTIME(i.updated_unix) AS '更新时间',
    FROM_UNIXTIME(c.updated_unix) AS '关闭时间'
FROM
	(
		issue i
        LEFT JOIN (SELECT * FROM `comment` c WHERE type = 2 GROUP BY issue_id ORDER BY issue_id DESC) c ON c.issue_id = i.id
		LEFT JOIN milestone m ON i.milestone_id = m.id
		LEFT JOIN repository r ON i.repo_id = r.id
		LEFT JOIN `user` cu ON i.poster_id = cu.id
		LEFT JOIN `user` au ON i.assignee_id = au.id
		INNER JOIN issue_label il ON i.id = il.issue_id
		INNER JOIN label l ON il.label_id = l.id
	)
WHERE
	(
		r.lower_name = 'assert'
		AND l.`name` = '类型/BUG'
	);

# 选择标签是'类型/BUG'的issue，并且issue的标题包含'不合适'(%代表任意字符)
SELECT
	r.lower_name AS '仓库名',
    i.`index` AS 'index',
	i.`name` AS 'issue名称',
	cu.`name` AS '创建人',
	m.`name` AS '里程碑',
	au.`name` AS '指派人',
	l.`name` AS '标签',
	i.is_closed AS '是否关闭',
	i.num_comments AS '评论数量',
    FROM_UNIXTIME(i.created_unix) AS '创建时间',
    FROM_UNIXTIME(i.updated_unix) AS '更新时间',
    FROM_UNIXTIME(c.updated_unix) AS '关闭时间'
FROM
	(
		issue i
        LEFT JOIN (SELECT * FROM `comment` c WHERE type = 2 GROUP BY issue_id ORDER BY issue_id DESC) c ON c.issue_id = i.id
		LEFT JOIN milestone m ON i.milestone_id = m.id
		LEFT JOIN repository r ON i.repo_id = r.id
		LEFT JOIN `user` cu ON i.poster_id = cu.id
		LEFT JOIN `user` au ON i.assignee_id = au.id
		INNER JOIN issue_label il ON i.id = il.issue_id
		INNER JOIN label l ON il.label_id = l.id
	)
WHERE
	(
		l.`name` = '类型/BUG'
		AND r.lower_name = 'assert'
		AND i.`name` LIKE '%不合适%'
	);

