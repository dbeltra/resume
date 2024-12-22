import React from "react";
import TabContent from "../components/tab-content";

const WidgetsContent = () => {
  return (
    <div className="">
      <p>This page is still in progress, come back later!.</p>
    </div>
  );
};

const Widgets = () => {
  return <TabContent Content={WidgetsContent}></TabContent>;
};

export default Widgets;
