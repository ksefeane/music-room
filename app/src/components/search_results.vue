<template>
    <div class="">
        <v-card v-if="found.songs" max-width="800" class="mx-auto overflow-hidden">
            <v-app-bar dark elevate-on-scroll scroll-target="#scrolling-techniques-7">
                <v-spacer></v-spacer>
                <v-toolbar-title class="headline font-weight-light">songs</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>
            <v-sheet id="scrolling-techniques-7" class="overflow-y-auto" max-height="800">
                <v-container style="max-height: 400px">
                    <v-list>
                        <v-list-item v-for="item in found.songs" :key="item.id">
                            <v-list-item-avatar>
                                <v-img :src="item.artist.picture_small"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{item.title}} - {{item.artist.name}}</v-list-item-title>
                            </v-list-item-content>
                            <v-btn text @click="playMusic(item.id)">
                                <v-icon>{{playIcon(item.id)}}</v-icon>
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-container>
            </v-sheet>
        </v-card>
        <!-- <v-card v-if="found.artists" max-width="800" class="mx-auto overflow-hidden">
            <v-app-bar dark elevate-on-scroll scroll-target="#scrolling-techniques-7">
                <v-spacer></v-spacer>
                <v-toolbar-title class="headline font-weight-light">artists</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>
            <v-sheet id="scrolling-techniques-7" class="overflow-y-auto" max-height="800">
                <v-container style="max-height: 400px">
                    <v-list>
                        <v-list-item v-for="item in found.artists" :key="item.id">
                            <v-list-item-avatar>
                                <v-img :src="item.picture_small"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon ><v-icon>{{playIcon(item.id)}}</v-icon></v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </v-container>
            </v-sheet>
        </v-card>
        <v-card v-if="found.albums" max-width="800" class="mx-auto overflow-hidden">
            <v-app-bar dark elevate-on-scroll scroll-target="#scrolling-techniques-7">
                <v-spacer></v-spacer>
                <v-toolbar-title class="headline font-weight-light">albums</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>
            <v-sheet id="scrolling-techniques-7" class="overflow-y-auto" max-height="800">
                <v-container style="max-height: 400px">
                    <v-list>
                        <v-list-item v-for="item in found.albums" :key="item.id">
                            <v-list-item-avatar>
                                <v-img :src="item.cover_small"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.title"></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon ><v-icon>{{playIcon(item.id)}}</v-icon></v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </v-container>
            </v-sheet>
        </v-card> -->
    </div>
</template>

<script>
import { get } from '@/functions/api'
import bus from '@/event_bus/bus'
import { mdiPlay, mdiStop } from '@mdi/js'


export default {
    name: 'Playlists',
   data() {
       return {
           id: '',
           
       }
   },
   props: {
       found: Object
   },
   computed: {
       playlists() {
           return this.$store.state.music.playlists}
   },
    methods: {
        playIcon(track_id) {
            return this.id === track_id ? mdiStop : mdiPlay
        },
        playMusic(track_id) {
            if (this.id === track_id) {
                this.id = ''
                bus.$emit('kill-music')
            } else {
                this.id = track_id
                get(`/music/song-info/${track_id}`)
                .then(r => {
                    let muse = `https://www.deezer.com/plugins/player?format=classic&autoplay=true&playlist=true&color=EF5466&layout=dark&size=small&type=tracks&id=${r.data.id}&app_id=1`
                    bus.$emit('player-music', muse)
                }).catch(e => {console.log(e)})
            }
        }
    }
}
</script>