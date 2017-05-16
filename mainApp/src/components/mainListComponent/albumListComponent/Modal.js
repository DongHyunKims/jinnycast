/**
 * Created by donghyunkim on 2017. 5. 7..
 */

import React, {Component} from 'react';


class Modal extends Component{





    constructor(props){
        super(props);
        this.state = {
            title : "",
            coverImgUrl : null,
            category : [],
        };

        this.handleItemInputChange = this.handleItemInputChange.bind(this);
    }

    componentDidMount(){
        let {data} = this.props;
        //console.log("asdfasdfs");
        if(data) {
            let {title,coverImgUrl,category} = data;
            this.setState(() => {

                return {
                    title : title,
                    coverImgUrl : coverImgUrl,
                    category : category,
                }

            });
        }
    }



    handleItemInputChange(data,event){
        let target = event.target;
        let nextState = {};
        let name = target.name;
        let {category} = this.state;


        let newCategory = [...category];

        switch(target.type){
            case "checkbox" :
                let value = target.value;
                if(target.checked) {
                    newCategory.push(value);
                }else{
                   let idx = newCategory.indexOf(value);
                    newCategory.splice(idx,1);
                }
                nextState = {
                    [name] : newCategory,
                };

                break;
            case "file" :
                nextState = {
                    [name] : target.files[0],
                };
                break;
            default:
                nextState = {
                    [name] : target.value,
                };
        }


        this.setState((state)=>{
            return nextState;
        });
    }

    renderCategory(defaultCategoryTitle,category,data){



        return defaultCategoryTitle.map((val, idx)=>{
            if(category.indexOf(idx+1) !== -1){
                return <span key={idx} ><input type="checkbox" name="category" value={idx+1}  onChange={this.handleItemInputChange.bind(null,data)} checked /> {val}</span>
            }
            return <span key={idx} ><input  type="checkbox" name="category" value={idx+1}  onChange={this.handleItemInputChange.bind(null,data)} /> {val}</span>
        })


    }



    render(){
        let { itemCancelClickHandler, itemSubmitHandler, modalTitle, btnTitle, data, defaultCategoryTitle } = this.props;
        let {title,category} = this.state;

        return (
            <div id="myModal" className="modal">
                <div className="modalContent">
                    <div className="modalHeader">
                        <span className="close"  onClick={itemCancelClickHandler}>&times;</span>
                        <h3>{modalTitle}</h3>
                    </div>
                    <div className="modalBody">
                        <div className="modalFormContainer">
                            <label><b>Title</b></label>
                            <input type="text" placeholder="Title" name="title" onChange={this.handleItemInputChange.bind(null,data)} value={title} required />
                            <label><b>Album Image</b></label>
                            <input type="file" name="coverImgUrl" onChange={this.handleItemInputChange.bind(null,data)} required />
                            <label><b>Category</b></label>
                            <div className="modalFormCheckContainer">
                                {this.renderCategory(defaultCategoryTitle,category,data)}
                            </div>
                        </div>
                    </div>
                    <div className="modalFooter">
                            <input type="button" className="button"  value={btnTitle} onClick={itemSubmitHandler.bind(null,this.state)}/>
                            <input type="button" className="button" onClick={itemCancelClickHandler} value="취소" />
                    </div>
                </div>
            </div>

        );

    }
}


Modal.defaultProps = {
    defaultCategoryTitle : ["Pop", "Hiphop", "Rock", "Ballad"],
    btnTitle: "확인",
    modalTitle: "Modal",
};


//onSubmit={addAlbumSubmitHandler.bind(null,this.state)}
export default Modal;