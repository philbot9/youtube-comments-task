import cheerio from 'cheerio'

export const COMMENT_ID = 'z12vvvxaryjywra0h234jdcg5p24zbvol04'
export const COMMENT_USER = 'the_comment_username'
export const COMMENT_FROMNOW = '1 month ago'
export const COMMENT_TEXT = 'This is the actual comment text.'
export const COMMENT_LIKES = 3

export const REPLY_ID = '1475411087107188'
export const REPLY_USER = 'the_reply_username'
export const REPLY_FROMNOW = '1 week ago'
export const REPLY_TEXT = 'This is the actual reply text.'
export const REPLY_LIKES = 1

export default function buildCommentSample (params = {}) {
  const {
    id = COMMENT_ID,
    user = COMMENT_USER,
    fromNow = COMMENT_FROMNOW,
    text = COMMENT_TEXT,
    likes = COMMENT_LIKES,
    replies = []
  } = params

  return [
    commentTop({id, user, fromNow, text, likes}),
    replies.length ? buildReplies(id, replies) : '',
    commentBottom()
  ].join('')
}

function commentTop ({ id, user, fromNow, text, likes }) {
  return `
<section class="comment-thread-renderer" data-visibility-tracking="CKQBEMJ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-priority="0">
<div class="comment-renderer" data-visibility-tracking="CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-cid="${id}">
<a href="/channel/UCjp-_6mlFkVBZlG1nvKJ6bg" class="yt-uix-sessionlink  g-hovercard     " data-ytid="UCjp-_6mlFkVBZlG1nvKJ6bg" data-sessionlink="itct=CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">  <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-48">
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">

  <img data-ytimg="1" src="https://yt3.ggpht.com/-RcMiXUAfT18/AAAAAAAAAAI/AAAAAAAAAAA/amHviLmRIqE/s48-c-k-no-mo-rj-c0xffffff/photo.jpg" onload=";__ytRIL(this)" width="48" tabindex="0" height="48" role="img" alt="${user}">

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>
</a>


    <div id="comment-renderer-edit-z12vvvxaryjywra0h234jdcg5p24zbvol04" class="comment-simplebox-edit" data-editable-content-text="" data-image-src="" data-video-id="">
    </div>
<div class="comment-renderer-content"><div class="comment-renderer-header"><a href="/channel/UCjp-_6mlFkVBZlG1nvKJ6bg" class="yt-uix-sessionlink comment-author-text g-hovercard     " data-ytid="UCjp-_6mlFkVBZlG1nvKJ6bg" data-sessionlink="itct=CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">${user}</a><span class="comment-renderer-time" tabindex="0"><a href="/watch?v=XkcGuZHPbKk&amp;lc=z12vvvxaryjywra0h234jdcg5p24zbvol04" class=" yt-uix-sessionlink     " data-sessionlink="itct=CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">${fromNow}</a></span></div><div class="comment-renderer-text" tabindex="0" role="article">
<div class="comment-renderer-text-content">${text}</div><div class="comment-text-toggle hid"><div class="comment-text-toggle-link read-more"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Read more
</span></button></div><div class="comment-text-toggle-link show-less hid"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Show less
</span></button></div></div></div>

<div class="comment-renderer-footer" data-vote-status="INDIFFERENT"><div class="comment-action-buttons-toolbar">


    <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-link comment-renderer-reply comment-simplebox-trigger" type="button" onclick=";return false;" data-simplebox-id="comment-simplebox-reply-z12vvvxaryjywra0h234jdcg5p24zbvol04" data-simplebox-sessionlink="itct=CLIBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-simplebox-event="replycreated" data-simplebox-target="/comment_service_ajax?action_create_comment_reply=1" data-simplebox-params="EgtYa2NHdVpIUGJLayIjejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQqAggAMAA%3D" data-simplebox-label="Reply"><span class="yt-uix-button-content">Reply</span></button>

    <span class="comment-renderer-like-count off">${likes}</span>
    <span class="comment-renderer-like-count on">${(likes + 1)}</span>

      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-like i-a-v-sprite-like" type="button" onclick=";return false;" aria-label="Like" data-action-type="like" data-sessionlink-target="/comment_service_ajax?action_perform_comment_action=1" data-url="/comment_service_ajax?action_perform_comment_action=1" data-sessionlink="itct=CLMBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-action="CAUQAhojejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQqC1hrY0d1WkhQYktrMAA4AEoVMTA5NjA4NzA1MTYzMTA4NTA4NzI1UAA%3D"></button>

      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-dislike i-a-v-sprite-dislike" type="button" onclick=";return false;" aria-label="Dislike" data-action-type="dislike" data-sessionlink-target="/comment_service_ajax?action_perform_comment_action=1" data-url="/comment_service_ajax?action_perform_comment_action=1" data-sessionlink="itct=CLEBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-action="CAQQAhojejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQqC1hrY0d1WkhQYktrMAA4AEoVMTA5NjA4NzA1MTYzMTA4NTA4NzI1UAA%3D"></button>

  <div class="yt-uix-menu-container comment-renderer-action-menu yt-section-hover-container">

      <div class="yt-uix-menu yt-uix-menu-flipped hide-until-delayloaded">  <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-action-menu yt-uix-button-empty yt-uix-button-has-icon no-icon-markup  yt-uix-menu-trigger" type="button" onclick=";return false;" aria-pressed="false" role="button" aria-haspopup="true" aria-label="Action menu."><span class="yt-uix-button-arrow yt-sprite"></span></button>
<div class="yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden" role="menu">  <ul>
      <li role="menuitem">
                <div class="service-endpoint-action-container hid">
    </div>

    <button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  report-form-modal-renderer" data-innertube-clicktracking="CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-params="GiN6MTJ2dnZ4YXJ5anl3cmEwaDIzNGpkY2c1cDI0emJ2b2wwNCgBMhNGZWRlcmljbyBDYXZhbGx1Y2NpOlEIARACGiN6MTJ2dnZ4YXJ5anl3cmEwaDIzNGpkY2c1cDI0emJ2b2wwNCoLWGtjR3VaSFBiS2swAEoVMTA5NjA4NzA1MTYzMTA4NTA4NzI1UAA%3D" data-url="/flag_service_ajax?action_get_report_form=1">
    <span class="yt-ui-menu-item-label">Report spam or abuse</span>
  </button>


      </li>
  </ul>
</div></div>
  </div>
</div><div class="comment-renderer-replybox" id="comment-simplebox-reply-z12vvvxaryjywra0h234jdcg5p24zbvol04">
  <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-32">
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">

  <img data-ytimg="1" src="https://yt3.ggpht.com/-PrmuKbjhU_Y/AAAAAAAAAAI/AAAAAAAAAAA/M6JCmj2zJ0c/s108-c-k-no-mo-rj-c0xffffff/photo.jpg" onload=";__ytRIL(this)" width="32" tabindex="0" height="32" role="img" alt="${user}">

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>
</div></div></div></div><div class="comment-replies-renderer" data-visibility-tracking="CKUBEL51IhMIivG8hf2M0AIVB3hOCh3PWgpF">`
}

function buildReplies(commentId, replies) {
  return replies.map(reply => {
    const {
      id = REPLY_ID,
      user = REPLY_USER,
      fromNow = REPLY_FROMNOW,
      text = REPLY_TEXT,
      likes = REPLY_LIKES,
    } = reply

    return `
<div class="comment-renderer" data-visibility-tracking="CKYBELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-cid="${commentId}.${id}">
<a href="/channel/UC3GLl4md-J-6Sf9vw0dsAGA" class="yt-uix-sessionlink  g-hovercard     " data-ytid="UC3GLl4md-J-6Sf9vw0dsAGA" data-sessionlink="itct=CKYBELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">  <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-32">
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">

  <img data-ytimg="1" src="https://yt3.ggpht.com/-4_iHeqYxIk4/AAAAAAAAAAI/AAAAAAAAAAA/K18lLB-0RBY/s32-c-k-no-mo-rj-c0xffffff/photo.jpg" onload=";__ytRIL(this)" width="32" tabindex="0" height="32" role="img" alt="${user}">

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>
</a>


    <div id="comment-renderer-edit-z12vvvxaryjywra0h234jdcg5p24zbvol04.1475411087107188" class="comment-simplebox-edit" data-editable-content-text="" data-image-src="" data-video-id="">
    </div>
<div class="comment-renderer-content"><div class="comment-renderer-header"><a href="/channel/UC3GLl4md-J-6Sf9vw0dsAGA" class="yt-uix-sessionlink comment-author-text g-hovercard     " data-ytid="UC3GLl4md-J-6Sf9vw0dsAGA" data-sessionlink="itct=CKYBELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">${user}</a><span class="comment-renderer-time" tabindex="0"><a href="/watch?v=XkcGuZHPbKk&amp;lc=z12vvvxaryjywra0h234jdcg5p24zbvol04.1475411087107188" class=" yt-uix-sessionlink     " data-sessionlink="itct=CKYBELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">${fromNow}</a></span></div><div class="comment-renderer-text" tabindex="0" role="article">
<div class="comment-renderer-text-content">﻿${text}</div>
<div class="comment-text-toggle hid"><div class="comment-text-toggle-link read-more"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Read more
</span></button></div><div class="comment-text-toggle-link show-less hid"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Show less
</span></button></div></div></div>

<div class="comment-renderer-footer" data-vote-status="INDIFFERENT"><div class="comment-action-buttons-toolbar">


    <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-link comment-renderer-reply comment-simplebox-trigger" type="button" onclick=";return false;" data-simplebox-id="comment-simplebox-reply-z12vvvxaryjywra0h234jdcg5p24zbvol04.1475411087107188" data-attachment-editor-trigger="image" data-simplebox-sessionlink="itct=CKsBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-simplebox-event="replycreated" data-simplebox-target="/comment_service_ajax?action_create_comment_reply=1" data-simplebox-params="EgtYa2NHdVpIUGJLayIjejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQqAggAMAA%3D" data-simplebox-label="Reply"><span class="yt-uix-button-content">Reply</span></button>

    <span class="comment-renderer-like-count off">${likes}</span>
    <span class="comment-renderer-like-count on">${(likes + 1)}</span>

      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-like i-a-v-sprite-like" type="button" onclick=";return false;" aria-label="Like" data-action-type="like" data-sessionlink-target="/comment_service_ajax?action_perform_comment_action=1" data-url="/comment_service_ajax?action_perform_comment_action=1" data-sessionlink="itct=CKwBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-action="CAUQAho0ejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQuMTQ3NTQxMTA4NzEwNzE4OCoLWGtjR3VaSFBiS2swATgAShUxMTI3OTk4Mjc4MDAyMTg4NTg3NTdQAA%3D%3D"></button>

      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-dislike i-a-v-sprite-dislike" type="button" onclick=";return false;" aria-label="Dislike" data-action-type="dislike" data-sessionlink-target="/comment_service_ajax?action_perform_comment_action=1" data-url="/comment_service_ajax?action_perform_comment_action=1" data-sessionlink="itct=CKoBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-action="CAQQAho0ejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQuMTQ3NTQxMTA4NzEwNzE4OCoLWGtjR3VaSFBiS2swATgAShUxMTI3OTk4Mjc4MDAyMTg4NTg3NTdQAA%3D%3D"></button>

  <div class="yt-uix-menu-container comment-renderer-action-menu yt-section-hover-container">

      <div class="yt-uix-menu yt-uix-menu-flipped hide-until-delayloaded">  <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-action-menu yt-uix-button-empty yt-uix-button-has-icon no-icon-markup  yt-uix-menu-trigger" type="button" onclick=";return false;" aria-pressed="false" role="button" aria-haspopup="true" aria-label="Action menu."><span class="yt-uix-button-arrow yt-sprite"></span></button>
<div class="yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden" role="menu">  <ul>
      <li role="menuitem">
                <div class="service-endpoint-action-container hid">
    </div>

    <button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  report-form-modal-renderer" data-innertube-clicktracking="CKYBELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-params="GjR6MTJ2dnZ4YXJ5anl3cmEwaDIzNGpkY2c1cDI0emJ2b2wwNC4xNDc1NDExMDg3MTA3MTg4KAEyClJ1YXRhIEhtYXI6YggBEAIaNHoxMnZ2dnhhcnlqeXdyYTBoMjM0amRjZzVwMjR6YnZvbDA0LjE0NzU0MTEwODcxMDcxODgqC1hrY0d1WkhQYktrMAFKFTExMjc5OTgyNzgwMDIxODg1ODc1N1AA" data-url="/flag_service_ajax?action_get_report_form=1">
    <span class="yt-ui-menu-item-label">Report spam or abuse</span>
  </button>


      </li>
  </ul>
</div></div>
  </div>
</div><div class="comment-renderer-replybox" id="comment-simplebox-reply-z12vvvxaryjywra0h234jdcg5p24zbvol04.1475411087107188">
  <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-32">
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">

  <img data-ytimg="1" src="https://yt3.ggpht.com/-PrmuKbjhU_Y/AAAAAAAAAAI/AAAAAAAAAAA/M6JCmj2zJ0c/s108-c-k-no-mo-rj-c0xffffff/photo.jpg" onload=";__ytRIL(this)" width="32" tabindex="0" height="32" role="img" alt="${user}">

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>
</div></div></div></div>`
  }).join('\n')
}

function commentBottom () {
  return '</div></section>'
}
