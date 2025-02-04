import { useState } from "react";
import Container from "../../../../components/Container";
import ContentActions from "./Components/ContentActions";
import { CONTENT_TYPES } from "../../../../constants";
import ContentDiv from "./Components/ContentDiv";
import VideoDiv from "./Components/VideoDiv";
import ArticleDiv from "./Components/ArticleDiv";

function Content() {
  const [contentType, setContentType] = useState(CONTENT_TYPES.CONTENT);

  return (
    <Container className="">
      <ContentActions
        setContent={(classType: CONTENT_TYPES) => setContentType(classType)}
      />
      {contentType === CONTENT_TYPES.CONTENT ? <ContentDiv /> : null}
      {contentType === CONTENT_TYPES.ARTICLE ? <ArticleDiv /> : null}
      {contentType === CONTENT_TYPES.VIDEO ? <VideoDiv /> : null}
    </Container>
  );
}

export default Content;
