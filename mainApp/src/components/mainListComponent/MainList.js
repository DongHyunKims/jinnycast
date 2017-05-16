/**
 * Created by donghyunkim on 2017. 5. 4..
 */
import React from "react"
import AlbumList from "./albumListComponent/AlbumListSection";
import SearchList from "./searchListComponent/SearchListSection";

class MainList extends React.Component{
    constructor(props){
        super(props);

    }

// serachList로 변경할 경우 처음 누른 경우에만 해당 state값 변경
    componentWillReceiveProps(nextProps){
      if(this.props.navIdx !== nextProps.navIdx){
        this.props.initSearchList()
      }
    }


    render(){

        let {
            //searchList
            addSelectedVideo,
            delSelectedVideo,
            changeIsAllClearAddBtn,
            addSelectedVideoToAlbum,
            items,
            moreVideoList,
            isSelectedArr,
            isAllClearAddBtn,
            searchVideo,

            isSearched,

            //albumList
            albumList,
            isAddClicked,
            updateAlbum,
            isAlbumUpdateClicked,
            albumClickHandler,
            deleteAlbumClickHandler,
            addAlbumSubmitHandler,
            addItemClickHandler,
            addItemCancelClickHandler,
            updateAlbumClickHandler,
            updateItemClickHandler,
            updateItemCancelClickHandler,
            navIdx

        } = this.props;




        let renderingMain = null;
        switch (navIdx){
            case "1" : renderingMain =  < SearchList

                items={items}
                isSelectedArr={isSelectedArr}
                isAllClearAddBtn={isAllClearAddBtn}
                addSelectedVideo={addSelectedVideo}
                delSelectedVideo={delSelectedVideo}
                changeIsAllClearAddBtn={changeIsAllClearAddBtn}
                addSelectedVideoToAlbum={addSelectedVideoToAlbum}
                searchVideo={searchVideo}
                moreVideoList={moreVideoList}

                isSearched={isSearched}

            />;
            break;
            case "2" : renderingMain = < AlbumList
                albumList={albumList}
                isAddClicked={isAddClicked}
                updateAlbum={updateAlbum}
                isAlbumUpdateClicked={isAlbumUpdateClicked}
                albumClickHandler={albumClickHandler}
                deleteAlbumClickHandler={deleteAlbumClickHandler}
                addAlbumSubmitHandler={addAlbumSubmitHandler}
                addItemClickHandler={addItemClickHandler}
                addItemCancelClickHandler={addItemCancelClickHandler}
                updateAlbumClickHandler={updateAlbumClickHandler}
                updateItemClickHandler={updateItemClickHandler}
                updateItemCancelClickHandler={updateItemCancelClickHandler}
            />;
            break;
            default : break;

        }

        return(
            <div className="rightArea">
                {renderingMain}
            </div>
        )
    }
}

export default MainList;
