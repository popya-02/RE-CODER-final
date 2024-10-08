package com.heartlink.matching.area.controller;

import com.heartlink.matching.area.model.dto.BoundsRequestDto;
import com.heartlink.matching.area.model.dto.MatchingAreaDto;
import com.heartlink.matching.area.model.service.MatchingAreaService;
import com.heartlink.member.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/matching-area")
public class MatchingAreaController {

    private final MatchingAreaService areaService;
    private final MatchingAreaService matchingAreaService;
    private final JwtUtil jwtUtil;

    @Autowired
    public MatchingAreaController(MatchingAreaService areaService, MatchingAreaService matchingAreaService, JwtUtil jwtUtil){
        this.areaService = areaService;
        this.matchingAreaService = matchingAreaService;
        this.jwtUtil = jwtUtil;
    }

    // SecurityContext에서 userId 가져오기
    private int getCurrentUserNo() {
        String jwt = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        return jwtUtil.getUserNumberFromToken(jwt);
    }


    @GetMapping("/main")
    public String moveMain(Model model){

        int userNo = getCurrentUserNo();

        MatchingAreaDto takeLocation = areaService.setUserLocation(userNo);

        model.addAttribute("addr" ,takeLocation.getUserAddr());
        model.addAttribute("userSex" ,takeLocation.getBasicUserSex());

        return "matching/area_based/matching-main";
    }

    @PostMapping("/bounds")
    public ResponseEntity<List<MatchingAreaDto>> searchMaker(Model model,
                                                                  @RequestBody BoundsRequestDto bounds){

        List<MatchingAreaDto> userList = matchingAreaService.getUserIsBounds(bounds);

        return ResponseEntity.ok(userList);
    }

}
