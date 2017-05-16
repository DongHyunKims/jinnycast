/**
 * Created by donghyunkim on 2017. 5. 2..
 */


import React, {Component} from 'react';
import SearchInputBox from "./SearchInputSection";
import AlbumList from "./AlbumList";
import "./albumListSection.css";





class MainList extends Component {

    constructor(props){
        super(props);
    }



    render(){
        let { albumList, albumClickHandler, deleteAlbumClickHandler,addAlbumSubmitHandler, addItemClickHandler,addItemCancelClickHandler ,isAddClicked} = this.props;




        return(
            <div>
                <SearchInputBox
                    searchVideo = {this.searchVideo}
                />
                <AlbumList
                    items={albumList}
                    isAddClicked={isAddClicked}
                    albumClickHandler={albumClickHandler}
                    deleteAlbumClickHandler={deleteAlbumClickHandler}
                    addAlbumSubmitHandler={addAlbumSubmitHandler}
                    addItemClickHandler={addItemClickHandler}
                    addItemCancelClickHandler={addItemCancelClickHandler}
                />
            </div>
        )
    }

}


export default MainList;