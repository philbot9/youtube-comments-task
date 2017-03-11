# youtube-comments-task

Scrape comments, including their replies, from a YouTube video.

[![Build Status](https://travis-ci.org/philbot9/youtube-comments-task.svg?branch=master)](https://travis-ci.org/philbot9/youtube-comments-task)


## Contents

* [Installation](#installation)
* [Usage](#usage)
* [Comment Data](#comment-data)
* [Errors](#errors)
* [Task](#task)
* [Compatibility](#compatibility)
* [Examples](#examples)

## Installation

``` bash
npm install --save youtube-comments-task
```

## Usage

The module exports a single function:

`fetchComments(videoId[,pageToken])`

The function accepts the YouTube `videoId` and an optional `pageToken`, and returns a [**Task**](#task) that resolves to the corresponding page of comments. If the `pageToken` is not provided it fetches the first page of comments.

The result is an object with the following properties.

``` javascript
{
  comments: [ { comment }, { comment }, ... ],
  nextPageToken: 'nextpagetokenhere'
}
```

**Note:** If the fetched page is the last page, the result does not contain the `nextPageToken` property.

## Comment Data

```
{
  id: {{ comment id}},
  author: {{ comment author name }},
  authorLink: {{ comment author link (channel) }},
  authorThumb: {{ comment author avatar thumb url }},
  text: {{ comment text }},
  likes: {{ comment up-votes }},
  time: {{ how long ago the comment was posted (relative, e.g. '1 year ago') }},
  timestamp: {{ timestamp when comment was posted in milliseconds (absolute, e.g. 1457661439642 }},
  edited: {{ whether the comment was edited by the authro (true/false) }},
  hasReplies: {{ whether the comment has replies (true/fasle) }},
  repliesToken: {{ token used to fetch replies for the comment }},
  numReplies: {{ number of replies }},
  replies: [ {{ reply objects (same fields as comments) }} ]
}
```

## Errors

Errors are as descriptive and (hopefully) useful as possible. Private, deleted, and unavailable videos are detected, and an appropriate error type is assigned. Error types are defined in [/src/lib/error-types.js](/src/lib/error-types.js).

A typical error object has the following fields.

```
{
  type: {{ error type }},
  message: {{ error message }},
  videoId: {{ YouTube video id }},
  component: {{ module component }},
  operation: {{ operation that failed }}
}
```

## Task

The module uses [Folktale's Task monad](http://docs.folktalejs.org/en/latest/api/data/task/) ([data.task](https://github.com/folktale/data.task)) to handle asynchronicity and to allow for easy composition.

If you'd rather use **Promises** instead of Tasks, check out [youtube-comment-api](https://github.com/philbot9/youtube-comment-api).

## Compatibility

The module is transpiled with **Babel** and is compatible with node.js versions **>= 0.12**.

## Examples

``` javascript
const fetchComments = require('youtube-comments-task')

fetchComments('h_tkIpwbsxY')
  .fork(e => console.error('ERROR', e),
        p => {
          console.log('comments', p.comments)
          console.log('nextPageToken', p.nextPageToken)
        })
```

``` javascript
const Task = require('data.task')
const fetchComments = require('youtube-comments-task')

const fetchAllComments = (videoId, pageToken, fetched = []) =>
  fetchComments(videoId, pageToken)
    .chain(({ comments, nextPageToken }) =>
      nextPageToken
        ? fetchAllComments(videoId, nextPageToken, fetched.concat(comments))
        : Task.of(fetched.concat(comments)))

fetchAllComments('h_tkIpwbsxY')
  .fork(e => console.error('ERROR', e),
        allComments => console.log(allComments))

```
