package com.notesphere.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = {"/{path:[^\\.]*}", "/", "/login", "/register", "/profile", "/repositories", "/search", "/add-note"})
    public String forward() {
        System.out.println("FrontendController is triggered");
        return "forward:/index.html";
    }
}