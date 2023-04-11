import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { Storage } from "aws-amplify";
import { APP_API_URL, downloadFile } from "../../constant";
import axios from "axios";
import "./Home.css";

function Home(props) {
  const {userId} = props
  const navigate = useNavigate();
  const redirectPage = () => {
    navigate("/upload");
  };
  const fieldTrans = {
    name: "file.S",
    tag: "tag.S",
    type: "type.S",
  };
  const [keyword, setKeyword] = useState("");
  const [attribute, setAttribute] = useState("name");
  const [searchResult, setSearchResult] = useState([]);
  const welcome = useRef(null);
  const searchEl = useRef(null);
  var timer = 0;
  // const attribute = useRef(null);
  useEffect(() => {
    if (keyword) {
      search(keyword);
    }
  }, [attribute]);

  const searchDocs = (event) => {
    clearTimeout(timer);
    if (searchEl.current.classList[1] === "non-active") {
      welcome.current.classList.toggle("non-active");
      searchEl.current.classList.remove("non-active");
    }
    setKeyword(event.target.value);
    timer = setTimeout(() => search(event.target.value), 250);
  };

  async function search(key) {
    const params = {
      key: key,
      field: fieldTrans[attribute],
    };
    console.log("params: ", params);
    try {
      // Search document follow attribute
      const response = await axios({
        method: "get",
        url: `${APP_API_URL}/docs/${userId}/search`,
        params: params,
      });
      console.log("Search successful: ", response);
      setSearchResult(response.data.hits.hits);
    } catch {
      alert("Error occured while search the documents");
    }
  }

  return (
    <div className="home">
      <div className="title content-header">Home</div>
      <div className="home-header">
        <div className="row">
          <div className="col">
            <input
              className="text-normal"
              placeholder="Search..."
              onKeyUp={searchDocs}
            ></input>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{ width: "10%" }}
            ></i>
            <div className="row pt-2">
              <div className="col-5">
                <div className="attribute-item">
                  <input
                    className="check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="name"
                    value="Name"
                    defaultChecked
                    onChange={(e) => setAttribute(e.target.id)}
                  />
                  &nbsp;&nbsp;
                  <label className="text-normal">Name</label>
                </div>
                <div className="attribute-item">
                  <input
                    className="check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="type"
                    value="Type"
                    onChange={(e) => setAttribute(e.target.id)}
                  />
                  &nbsp;&nbsp;
                  <label className="text-normal">Type</label>
                </div>
              </div>
              <div className="col-5">
                <div className="attribute-item">
                  <input
                    className="check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="tag"
                    value="Tag"
                    onChange={(e) => setAttribute(e.target.id)}
                  />
                  &nbsp;&nbsp;
                  <label className="text-normal">Tag</label>
                </div>
              </div>
            </div>
          </div>
          <div className="col" style={{ textAlign: "right" }}>
            <button
              type="button"
              className="btn btn-gray text-normal"
              onClick={redirectPage}
            >
              <i className="fa-solid fa-upload icon-sm" aria-hidden="true"></i>
              &nbsp;Upload
            </button>
          </div>
        </div>
      </div>
      <div className="home-body" style={{ textAlign: "center" }}>
        <span className="text-header" ref={welcome}>
          Welcome to <br /> FCJ Document Management System{" "}
        </span>
        <div className="search-result non-active" ref={searchEl}>
          <div className="pt-25">
            <div className="row table-title text-normal text-black pt-70 pb-70">
              <div className="col-3">Title</div>
              <div className="col-2 bleft">Modified</div>
              <div className="col-2 bleft">Type</div>
              <div className="col-1 bleft">Size</div>
              <div className="col bleft">Tag</div>
            </div>
            <div className="document-table">
              {searchResult.length !== 0 &&
                searchResult.map((doc, index) => (
                  <div
                    className="row table-body text-normal pt-25 pb-25 mt-2"
                    key={index}
                  >
                    <div className="col-3 hidden-long">
                      {doc._source.file.S}
                    </div>
                    <div className="col-2">{doc._source.modified.S}</div>
                    <div className="col-2 hidden-long">
                      {doc._source.type.S}
                    </div>
                    <div className="col-1">{doc._source.size.S}</div>
                    <div className="col-3 hidden-long">
                      {doc._source.tag ? doc._source.tag.S : ""}
                    </div>
                    <div className="col down-icon">
                      <i
                        className="fa-sharp fa-solid fa-circle-down"
                        onClick={() =>
                          downloadFile(doc._source.file.S, doc._source.path.S)
                        }
                      ></i>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="home-footer"></div>
    </div>
  );
}

export default Home;
