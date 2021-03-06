import axios from 'axios'
import { addUserId, createLicenses, deleteLicense, getAccessCode, checkProfile, editProfile,
    updateLicenses, fetchUsers
} from "../models/userModel";

const deezer = 'https://api.deezer.com'

//get profile from deezer api
export async function getProfile(req, res) {
    try {
        let details = await axios.get(`${deezer}/user/me?access_token=${req.token}`)
        //console.log(details)
        addUserId(details.data.id, details.data.email)
        updateLicenses(details.data.id, req.token)
        let profile = await checkProfile(details.data)
        //console.log(profile.username+': '+req.token)
        res.send({
            'id': profile.user_id,
            'username':profile.username,
            'first_name':profile.first_name,
            'last_name': profile.last_name,
            'email': profile.email,
            'img':details.data.picture_medium
        })
    } catch (e) {res.send(e)}
}
//get friends (followers & followings)
export async function getFriends(req, res) {
    try {
        let followers = axios.get(`${deezer}/user/me/followers?access_token=${req.token}`)
        let followings = axios.get(`${deezer}/user/me/followings?access_token=${req.token}`)
        let friends = await Promise.all([followers, followings])
        .catch(e => {console.log(e)})
        res.send({
            'followers':friends[0].data.data, 
            'followings':friends[1].data.data
        })
    } catch (e) {res.send(e)}
}
//get settings
export async function getSettings(req, res) {
    try {
        //localSettings()
        axios.get(`${deezer}/user/me/options?access_token=${req.token}`)
        .then(r => {
            delete r.data.type
            res.send(r.data)
        })
        .catch(e => {console.log(e)})
    } catch (e) {res.send(e)}
}

//follow a user
export async function followUser(req, res) {
    try {
        let user = req.body.user_id
        axios.get(`${deezer}/user/me/followings?access_token=${req.token}&request_method=post&user_id=${user}`)
        .then(results => {
            res.send(results.data)
        }).catch(e => {
            console.log(e)
        })
    } catch (error) {res.send(error)}
}

//unfollow a user
export async function unfollowUser(req, res) {
    try {
        let user = req.body.user_id
        axios.get(`${deezer}/user/me/followings?access_token=${req.token}&request_method=delete&user_id=${user}`)
        .then(results => {
            res.send(results.data)
        }).catch(e => {console.log(e)})
    } catch (error) {res.send(error)}
}

//add playlist
export async function postplaylist(req, res) {
    let path = `https://api.deezer.com/user/me/playlists`
    let access = `?access_token=${token}`
    var pay = req.body
    //console.log(pay)
    axios.post(path+access, {"title":"testing2"})
    .then(res => {console.log(res.data)})
    .catch(e => {console.log(e)})
}
//get playlists
export async function getplaylist(req, res) {
    let path = `https://api.deezer.com/user/me/playlists`
    let access = `?access_token=${req.token}`
    // axios.get(path+access)
    // .then(result => res.send({"success": result}))
    // .catch(e => {console.log(e)})
    let result = await axios.get(path + access)
    res.send(result.data)
}

export async function getAlbumInfo(req, res) {
    let path = 'https://api.deezer.com/album/'
    let album_id = req.params.id
    let result = await axios.get(path + album_id)
    res.send(result.data)
}

export async function getSongInfo(req, res) {
    let path = 'https://api.deezer.com/track/'
    let song_id = req.params.id
    let result = await axios.get(path + song_id)
    res.send(result.data)
}

export async function searchTrack(req, res) {
    let path = 'http://api.deezer.com/search/track?q='
    let track = req.params.track
    let result = await axios.get(path + track)
    res.send(result.data)
}

export async function searchAlbum(req, res) {
    let path = 'http://api.deezer.com/search/album?q='
    let album = req.params.album
    let result = await axios.get(path + album)
    res.send(result.data)
}

export async function searchArtist(req, res) {
    let path = 'http://api.deezer.com/search/artist?q='
    let artist = req.params.artist
    let result = await axios.get(path + artist)
    res.send(result.data)
}

export async function getChart(req, res) {
    let path = 'https://api.deezer.com/chart'
    let result = await axios.get(path)
    res.send(result.data)
}

export async function makeLicense(req, res) {
    try {
        let fax = await createLicenses(req.body, req.token)
        res.send(fax)
    }
    catch (e) {console.log(e)}
    // var token = req.body.token
    // var user_id = req.body.user_id
    // var playlist_id = req.body.playlist_id
    // var playlist_name = req.body.playlist_name
    // var access_token = req.token
    // let response = await createLicense(token, user_id, playlist_id, playlist_name,access_token)
    // res.send(response)
}

export async function removeLicense(req, res) {
    var user_id = req.body.user_id
    var playlist = req.body.playlist_id
    let result = await deleteLicense(user_id, playlist)
    res.send(result)
}

export async function getKey(req, res) {
    let playlist_id = req.body.playlist_id
    let user_id = req.body.user_id
    let result = await getAccessCode(user_id, playlist_id)
    res.send(result)
}

export async function editDetails(req, res) {
    try {
        let edit = await editProfile(req.body)
        res.send(edit)
    } catch (error) {
        res.send(error)
    }
}

export async function getUsers(req, res) {
    try {
        let users = await fetchUsers()
        res.send(users)
    } catch (error) {
        console.log(error)
    }
}