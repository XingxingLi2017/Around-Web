import React from 'react';
import $ from 'jquery';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY, AUTH_PREFIX, TOKEN_KEY, API_ROOT } from '../constants';
import {Gallery} from "./Gallery"
import {CreatePostButton} from "./CreatePostButton"

const TabPane = Tabs.TabPane;

const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,
        loadingPosts: false,
        error: '',
        posts: [],
    }

    componentDidMount(){
        this.setState({error: '', loadingGeoLocation: true})
        this.getGeoLocation();
    }
    getGeoLocation = ()=>{
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS
            )
        } else {
            this.setState({error: 'Your browser does not support geolocation!'})
        }
    }
    onSuccessLoadGeoLocation = (position)=>{
        console.log(position);
        const{latitude, longitude} = position.coords
        // local storage can only store string
        localStorage.setItem(POS_KEY, JSON.stringify({latitude, longitude}));
        this.setState(
            {
                error: "",
                loadingGeoLocation: false
            }
        );
        this.loadNearbyPosts();
    }
    onFailedLoadGeoLocation = () =>{
        this.setState({error: 'failed to load geolocation'});

    }
    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip = "Loading geo location..."/>
        } else if (this.state.loadingPosts) {
            return (<Spin tip = "Loading posts..."/>)
        } else if (this.state.posts && this.state.posts.length > 0) {
            const images = this.state.posts.map(({user, message, url})=>{
                return {
                    user,
                    src: url,
                    thumbnail: url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: message,
                }
            })
            return (<div>
                <Gallery images={images}/>
            </div>)
        }
    }


    loadNearbyPosts = () => {
        const { latitude:lat, longitude:lon } = JSON.parse(localStorage.getItem(POS_KEY));
        this.setState({ loadingPosts: true, error: ''});
        $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            }
        }).then((response) => {
            this.setState({ posts: response, loadingPosts: false, error: '' });
            console.log(response)
        }, (error)=>{
            this.setState({ loadingPosts: false, error: error.responseText });
        }).catch(((error) => {
                console.log(error)})
        )
    }

    render() {
        const operations = <CreatePostButton />
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Post" key="1">{this.getGalleryPanelContent()}</TabPane>
                <TabPane tab="Map" key="2">Content of tab 2</TabPane>
            </Tabs>
        );
    }
}
