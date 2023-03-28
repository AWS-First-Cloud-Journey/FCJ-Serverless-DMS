import React, { useEffect, useState, useRef } from "react";
import { APP_API_URL, downloadFile } from "../../constant";
import axios from "axios";
import { Storage } from "aws-amplify";
import { useNavigate } from "react-router-dom";

// import "./MyProfile.css";

function Document(props) {
  const { user } = props;
  const [docs, setDocs] = useState([]);
  const [mod, setMod] = useState(0); // different 1 is normal mod, 1 is selecting mod
  const [deleteList, setDeleteList] = useState([]);
  const navigate = useNavigate();
  const deleteEl = useRef(null);
  const selectEl = useRef(null);
  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = () => {
    axios({
      method: "get",
      url: `${APP_API_URL}/docs/${user.id}`,
    })
      .then((res) => {
        setDocs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (mod === 1) {
      selectEl.current.classList.toggle("non-active");
      deleteEl.current.classList.remove("non-active");
    }
    if (mod === 2) {
      deleteEl.current.classList.toggle("non-active");
      selectEl.current.classList.remove("non-active");
    }
  }, [mod]);

  const checkedDoc = (index, doc, event) => {
    let isChecked = event.target.checked;
    let currentList = deleteList;

    if (!isChecked) {
      currentList.splice(index, 1);
    } else {
      currentList.splice(index, 0, doc);
    }
    console.log("currentList ", currentList);
    setDeleteList(currentList);
  };

  const navigateToDetailPage = (index) => {
    if (mod === 1) return;
    const docItem = docs[index];
    navigate(`detail/${docItem.file}`, { state: docItem });
  };

  const deleteDocs = async (e) => {
    e.preventDefault();
    for (let i = 0; i < deleteList.length; i++) {
      try {
        await Storage.remove(deleteList[i].file, { level: "protected" });

        await axios({
          method: "delete",
          url: `${APP_API_URL}/docs/${user.id}`,
          params: {
            file: deleteList[i].file,
          },
        });
      } catch {
        alert("Error occured while delete the documents");
        break;
      }
    }

    setDeleteList([]);
    setMod(2);
    loadDocs();
  };

  return (
    <div className="upload-body">
      <div className="title content-header">My Document</div>
      <div className="content-body">
        <button
          type="button"
          className="btn btn-outline-secondary btn-gray text-normal"
          ref={selectEl}
          onClick={() => setMod(1)}
        >
          <i className="fa-solid fa-arrow-pointer"></i>
          &nbsp;Choose
        </button>
        <div className="mod-delete non-active" ref={deleteEl}>
          <button
            type="button"
            className="btn btn-outline-secondary btn-gray text-normal"
            onClick={deleteDocs}
          >
            <i className="fa-solid fa-trash"></i>
            &nbsp;Delete
          </button>
          &nbsp;&nbsp;
          <button
            type="button"
            className="btn btn-outline-secondary btn-gray text-normal"
            onClick={() => setMod(2)}
          >
            <i className="fa-sharp fa-regular fa-circle-check"></i>
            &nbsp;Done
          </button>
        </div>
        <div className="pt-3">
          <div className="row table-title text-normal text-black pt-70 pb-70">
            <div className="col-11 row">
              <div className="col-3">Title</div>
              <div className="col-2 bleft">Modified</div>
              <div className="col-2 bleft">Type</div>
              <div className="col-1 bleft">Size</div>
              <div className="col bleft">Tag</div>
            </div>
          </div>
          <div className="document-table">
            {docs.length !== 0 &&
              docs.map((doc, index) => (
                <div
                  className="row table-body text-normal pt-25 pb-25 mt-2"
                  key={index}
                >
                  <div
                    className="col-11 row"
                    onClick={() => navigateToDetailPage(index)}
                  >
                    <div className="col-3 hidden-long">
                      <input
                        className={mod !== 1 ? "non-active" : ""}
                        type="checkbox"
                        style={{ width: "10%" }}
                        onChange={(event) => checkedDoc(index, doc, event)}
                      />
                      {doc.file}
                    </div>
                    <div className="col-2">{doc.modified}</div>
                    <div className="col-2 hidden-long">{doc.type}</div>
                    <div className="col-1">{doc.size}</div>
                    <div className="col-3 hidden-long">{doc.tag}</div>
                  </div>
                  <div className="col">
                    <div className="col down-icon">
                      <i
                        className="fa-sharp fa-solid fa-circle-down"
                        onClick={() =>
                          downloadFile(doc.file, doc.path, user.identityId)
                        }
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Document;
