
import React, { useEffect, useState, useRef } from "react";
import { downloadFile } from "../../constant";
import { filesize } from "filesize";

function SearchResultTable(props) {
  const { data, user, mod, message, checkedDoc, navigateToDetailPage } = props;
  console.log("data: ", data);
  return (
    <div className="pt-3">
      <div className="table-title">
        <div className="row-custome text-normal text-black pt-70 pb-70">
          <div className="col-11 row-custome">
            <div className="col-4">Title</div>
            <div className="col-2 bleft">Modified</div>
            <div className="col-2 bleft">Type</div>
            <div className="col-1 bleft">Size</div>
            <div className="col bleft">Tag</div>
          </div>
        </div>
      </div>
      <div className="document-table">
        {data.length !== 0 &&
          data.map((item, index) => (
            <div
              className="row-custome table-body text-normal pt-25 pb-25 mt-2"
              key={index}
            >
              <div
                className="col-11 row-custome"
                onClick={() => navigateToDetailPage(index)}
              >
                <div className="col-4 hidden-long">
                  <input
                    className={mod !== 1 ? "non-active" : ""}
                    type="checkbox"
                    style={{ width: "10%" }}
                    onChange={(event) => checkedDoc(index, item._source, event)}
                  />
                  {item._source.file.S}
                </div>
                <div className="col-2">{item._source.modified.S}</div>
                <div className="col-2 hidden-long">{item._source.type.S}</div>
                <div className="col-1">{filesize(item._source.size.N, { base: 1, standard: "jedec" })}</div>
                <div className="col-3 hidden-long">{item._source.tag.S}</div>
              </div>
              <div className="col">
                <div className="col down-icon">
                  <i
                    className="fa-sharp fa-solid fa-circle-down"
                    onClick={() =>
                      downloadFile(item._source.file.S, item.source.path.S, user.identityId)
                    }
                  ></i>
                </div>
              </div>
            </div>
          ))}
        {data.length === 0 && (
          <div className="text-normal" style={{ textAlign: "center" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultTable;
