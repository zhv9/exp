package controller

func RegisterRoutes() {
	// 静态路由，一个路径对应一个页面
	registerHomeRoutes()
	registerAboutRoutes()
	registerContactRoutes()

	// 动态路由
	registerCompanyRoutes()

	// json handler
	registerJsonRoutes()

	registerTimeoutRoutes()
}
