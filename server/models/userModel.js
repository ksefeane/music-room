import { fetchOne, insert, delOne, Update, delLicense, fetchOne2, fetchDelegate, fetchAll } from './query'
import axios from 'axios'
import jwt from 'njwt'
import keys from '../configs/keys'

export async function findOrCreate(user_data) {
    var user = await fetchOne('users', ['id', 'username', 'email', 'type'], 'email', user_data.email)
    if (Object.keys(user).length === 0) {
        let insertion = await insert('users', ['username', 'first_name', 'last_name', 'email', 'password', 'type'], [user_data.username, user_data.name, user_data.surname, user_data.email, '$Abc1234', 'oauth'])
        var user = {
            id: insertion.success.insertId, 
            username: user_data.username,
            email: user_data.email
        }
        return user
    }
    return (user[0])
}

export async function addUserId(user_id, email) {
    var user = await fetchOne('users', ['id'], 'email', email)
    //console.log(user)
    if (Object.keys(user).length > 0) {
        let addId = await Update('users', 'user_id', user_id, 'email', email)
        return addId
    }
    return null
}

export async function fetchUser(uid) {
    let user = await fetchone('users', ['id', 'username'], 'id', uid)
    return (user[0])
}

export async function getDeezerAccessToken(code) {
    let access_url = 'https://connect.deezer.com/oauth/access_token.php?app_id=' + keys.deezer.clientID + '&secret=' + keys.deezer.clientSecret + '&code=' + code;
    try {
        let response = await axios.get(access_url)
        let data = response.data.split("=")[1]
        let access_code = data.split("&")[0]
        return (access_code)
    } catch (error) {
        console.log("oops: ", error)
    }
}

//login user & create jwt token & insert token into database
export async function loginUser(user) {
    let token = jwt.create({'name':user}, keys.jwt)
    token = token.compact()
    insert('tokens', ['username', 'token', 'type'], [user, token, 'jwt'])
    .catch(e => {console.log(e)})
    return (token)
}

//find token user in database
export async function findUserToken(token) {
    return new Promise((yes, no) => {
        fetchOne('tokens', ['username'], 'token', token)
        .then(async user => {
            if(user.length > 0) {
                delOne('tokens', 'token', token).catch(e => {console.log(e)})
                yes(await loginUser(user[0].username))
            } else {no({"error":"not authorized"})}
        }).catch(e => {no({"error":"not authorized"})})
    })
}

export async function connectDeezer(access_token) {
    return new Promise((yes, no) => {
        try {
            let token = jwt.create({'token':access_token}, keys.jwt)
            token = token.compact()
            yes(token)
        } catch (e) {no({'error':e})}
    })
}

export async function createLicenses(data, access_token) {
    var user = await fetchOne('tokens', ['username'], 'token', data.token)
    if (Object.keys(user).length > 0) {
        let id = await fetchOne('users', ['user_id'], 'username', user[0].username)
        let holders = []
        for (let i in data.friends) {
            let hold = await fetchOne2('*', data.playlist_id, data.friends[i])
            if (hold.length === 0) {
                let params = ['owner', 'user', 'playlist_id', 'playlist_name', 'access_key']
                let vals = [id[0].user_id, data.friends[i], data.playlist_id, data.playlist_name, access_token]
                let ins = await insert('licenses', params, vals)
                holders.push('created')
            } else {holders.push('exists')}
        }
        return holders
    }
    return ({'error': 'no user'})
}

export async function deleteLicense(user_id, playlist_id) {
    let user = await delLicense(user_id, playlist_id)
    return user
}

export async function    getAccessCode(token, playlist_id) {
    var me = await fetchOne('tokens', ['username'], 'token', token)
    if (Object.keys(me).length > 0) {
        let id = await fetchOne('users', ['user_id'], 'username', me[0].username)
        let code = await fetchOne2('access_key', playlist_id, id[0].user_id)
        if (code.length > 0) {
            return code
        }
        return {'error': 'no key'}
    }
    return {'no': 'user'}
}

export async function fetchLicensedPlaylists(token) {
    var me = await fetchOne('tokens', ['username'], 'token', token)
    if (Object.keys(me).length > 0) {
        let id = await fetchOne('users', ['user_id'], 'username', me[0].username)
        let playlists = await fetchOne('licenses', ['playlist_name', 'playlist_id'], 'user', id[0].user_id)
        return playlists
    }
    return {'error':'no user'}
}

export async function delegateLicense(id, friends) {
    delOne('delegates', 'user_id', id)
    .catch(e => {console.log(e)})
    for (let i in friends) {
        insert('delegates', ['user_id', 'friend_id'], [id, friends[i]])
        .catch(e => {return({'error':e})})
    }
    return ({'success':'delegates successful'})
}

export async function updateLicenses(user_id, token) {
    let update = await Update('licenses', 'access_key', token, 'owner', user_id)
    return update
}

export async function findDelegate(uid, fid) {
    let r = await fetchDelegate(uid,fid)
    .catch(e => {return({'failure':'unexpected error'})})
    return (r.length > 0 ? true: false)
}

export async function checkProfile(data) {
    let check = await fetchOne('profiles', ['username', 'first_name', 'last_name', 'email', 'user_id'], 'email', data.email)
    if (!check.length) {
        let create = await createProfile(data)
        return create
    }
    return check[0] 
}

async function createProfile(data) {
    let params = ['username', 'first_name', 'last_name', 'email', 'user_id', 'pro_pic']
    let values = [data.name, data.firstname, data.lastname, data.email, data.id, data.picture_medium]
    let insertion = await insert('profiles', params, values)
    // console.log(insertion)
    // console.log('after create')
    return insertion
}

export async function editProfile(data) {
    let succ_updates = []
    let failed_updates = []
    let values = [data.first_name, data.last_name]
    let params = ['first_name', 'last_name']
    for (let index = 0; index < 2; index++) {
        if (values[index]) {
            let update_element = await Update('profiles', params[index], values[index], 'user_id', data.id)
            if (update_element.changedRows) {
                succ_updates.push(params[index])
            } else {
                failed_updates.push(params[index])
            }
        }
    }
    return {'success': succ_updates, 'failed': failed_updates}
}

export async function fetchUsers() {
    let users = await fetchAll('profiles')
    return users
}