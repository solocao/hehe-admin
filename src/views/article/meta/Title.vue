<template>
    <div class="article-title">
        <img :src="data.img_list[0].url" alt="">
        <div class="a-container">
            <div class="title">
                {{data.title}}
            </div>
            <div>
                {{timeS(data.create_at)}}
            </div>
        </div>
    </div>
</template>
<script>
import util from '../../../libs/util.js';
export default {
    props: {
        data: {
            default: null
        }
    },
    methods: {
        timeS (createAt) {
            return util.timeS(createAt);
        }
    }

};
</script>
<style lang="stylus" scoped>
.article-title {
    width: 400px;
    padding: 3px 0px;
    height: 66px;
    display: flex;
    align-items: center;

    img {
        width: 86px;
        height: 58px;
    }

    .a-container {
        width: 400px -78px;
        padding-left: 6px;
        display: flex;
        flex-direction: column;

        .title {
            // font-weight: bold;
        }
    }
}
</style>




