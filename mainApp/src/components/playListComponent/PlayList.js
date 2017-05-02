/**
 * Created by donghyunkim on 2017. 4. 24..
 */
import React, {Component} from 'react';
import "./playList.css";
//import YoutubePlayerComponent from "./YoutubePlayer";


import YoutubePlayerComponent from "./Youtube";
import PlayListSection from "./PlayListSection";

class PlayList extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedData : null,
            selectedKey : -1,
            intervalId : null,
        };
        this.playListClickHandler = this.playListClickHandler.bind(this);
    }
    playListClickHandler(key){
        let {playList} = this.props;
        this.setState({selectedData : playList[key], selectedKey : key});
    }

    render(){

        let {playList,deleteBtnClickHandler,checkClickHandler,selectAllBtnClickHandler,checkIdxList,selectAllIsChecked,onReady} = this.props;
        let {selectedData,selectedKey} = this.state;

        let opts = {
            height: '100%',
            width: '100%',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };

        let youtubePlayer = <div> loading... </div>;


        if(selectedData){
            let {videoId} = selectedData;
            youtubePlayer = <YoutubePlayerComponent videoId={videoId} opts={opts} onReady={onReady}/>
        }


        return (
          <div className="leftArea">
              <div className="youtubePlayerArea">
                {youtubePlayer}
              </div>
              <PlayListSection
                  playList={playList}
                  playListClickHandler={this.playListClickHandler}
                  selectedKey={selectedKey}
                  deleteBtnClickHandler={deleteBtnClickHandler}
                  checkClickHandler={checkClickHandler}
                  selectAllBtnClickHandler={selectAllBtnClickHandler}
                  checkIdxList={checkIdxList}
                  selectAllIsChecked={selectAllIsChecked}
              />
          </div>
        );
    }

}


//                    <AlbumListComponent videoData={videoData} albumListClickHandler={this.albumListClickHandler} selectedKey={selectedKey} />
export default PlayList;
