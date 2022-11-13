package services

import "strconv"

type UserService struct {
}

func (us UserService) GetName(userId int) string {
	return strconv.Itoa(userId)
}
