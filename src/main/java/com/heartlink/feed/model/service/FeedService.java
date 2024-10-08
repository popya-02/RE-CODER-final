package com.heartlink.feed.model.service;

import com.heartlink.feed.model.dto.FeedCommentDto;
import com.heartlink.feed.model.dto.FeedDto;
import com.heartlink.feed.model.mapper.FeedMapper;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class FeedService {

    private final FeedMapper feedMapper;

    @Autowired
    public FeedService(FeedMapper feedMapper){
        this.feedMapper = feedMapper;
    }

    public List<FeedDto> getFeedList(String tag, int start, int end, String feedArray){

        String feedTag = "전체";
        if (!tag.equals("전체")) {
            feedTag = tag;
        }

        List<FeedDto> textList = feedMapper.getFeedList(feedTag, start, end, feedArray);

        for (FeedDto feed : textList) {
            int feedNo = feed.getFeedNo();

            // 태그 다시 달아주기
            String originalContent = StringEscapeUtils.unescapeHtml4(feed.getFeedContent());
            feed.setFeedContent(originalContent);

            // 댓글 리스트 가져오기
            List<FeedCommentDto> commentList = feedMapper.getCommentList(feedNo);
            feed.setComments(commentList);

            // 좋아요 수 가져오기
            int likeCount = feedMapper.getLikeCount(feedNo);
            feed.setLikeCount(likeCount); // FeedDto 클래스에 좋아요 수를 저장할 수 있는 필드가 있어야 함

            // 좋아요 누른 유저 구분
            List<Integer> likedUser = feedMapper.getLikedUser(feedNo);
            feed.setLikedUser(likedUser != null ? likedUser : new ArrayList<>());

        }

        return textList;
    }

    @Transactional
    public int setFeedEnroll(FeedDto feedDto){
        return feedMapper.setFeedEnroll(feedDto);
    }

    @Transactional
    public int setCommentEnroll(FeedCommentDto commentDto){
        return feedMapper.setCommentEnroll(commentDto);
    }

    public FeedDto setModifyFeed(int feedNo){

        FeedDto selectEdit = feedMapper.setModifyFeed(feedNo);

        String originContent = StringEscapeUtils.unescapeHtml4(selectEdit.getFeedContent());
        selectEdit.setFeedContent(originContent);

        return selectEdit;
    }

    @Transactional
    public int setUpdateFeed(FeedDto feedDto){

        return feedMapper.setUpdateFeed(feedDto);
    }

    @Transactional
    public int setCommentDelete(int commentNo){
        return feedMapper.setCommentDelete(commentNo);
    }

    @Transactional
    public int setFeedDelete(int feedNo){
        return feedMapper.setFeedDelete(feedNo);
    }

    @Transactional
    public int setFeedLike(int feedNo, int userNo){
        return feedMapper.setFeedLike(feedNo, userNo);
    }

    @Transactional
    public int setFeedLikeCancel(int feedNo, int userNo){
        return feedMapper.setFeedLikeCancel(feedNo, userNo);
    }
}
