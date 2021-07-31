package middleware

import (
	"context"
	"net/http"
	"time"
)

type TimeoutMiddleware struct {
	Next http.Handler
}

func (tm TimeoutMiddleware) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	if tm.Next == nil {
		tm.Next = http.DefaultServeMux
	}

	ctx := r.Context()
	ctx, _ = context.WithTimeout(ctx, 3*time.Second)
	r = r.WithContext(ctx) // 用新的 context 代替以前的

	ch := make(chan struct{})
	go func() {
		tm.Next.ServeHTTP(rw, r)
		ch <- struct{}{} // 在处理完后面的工作后给 ch 放一个空 struct{}
	}()

	select {
	case <-ch: // 如果先从 ch 获取到内容，那么就直接返回
		return
	case <-ctx.Done(): // 如果 ctx 先 Done() 说明超时了，那就返回超时的状态
		rw.WriteHeader(http.StatusRequestTimeout)
	}
	ctx.Done()
}
