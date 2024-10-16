package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService;

import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coworkings")
public class CoworkingRestController extends ORestController<ICoworkingService> {

    @Autowired
    private ICoworkingService coworkingService;

    @Override
    public ICoworkingService getService() {
        return this.coworkingService;
    }
}