<template>
    <div class="article-title">
        <img :src="data.img_list[0].url" alt="">
        <div class="a-container">
            <div class="title">
                {{data.title}}</div>
            <div>
                分类 标签
            </div>
            <div>
                评论 喜欢
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            default: null
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

        .title {
            // font-weight: bold;
        }
    }
}
</style>




