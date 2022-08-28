package com.zhv9.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Health {
    @GetMapping("/healthcheck")
    public String healthCheck() {
        return "great";
    }
}
