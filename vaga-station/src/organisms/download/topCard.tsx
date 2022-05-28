import React from "react";

import { TopCardWrapper, TitleTypo, SubTitleTypo } from "./styles";

const TopCard = () => {
  return (
    <TopCardWrapper>
      <TitleTypo>Download</TitleTypo>
      <SubTitleTypo>Vaga Station Desktop App</SubTitleTypo>
    </TopCardWrapper>
  );
};

export default React.memo(TopCard);
