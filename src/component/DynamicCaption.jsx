import React from "react";

export default function DynamicCaption({caption, photo}) {

    const regexHashTag = /#\w+/g;
    const replacedString = caption.replace(regexHashTag, `<span class="post___hashtag">$&</span>`);
  const newContent = caption.replaceAll(
    regexHashTag,replacedString);

  return <p className={`post___caption ${!photo && "post___nophoto"}`} dangerouslySetInnerHTML={{ __html: newContent }}></p>;
}

