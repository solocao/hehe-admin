<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList" :key="item.id">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <div class="cooperate">
                        <div @click="handleView(item)">
                            <Icon type="ios-eye-outline"></Icon>
                            <span>预览</span>
                        </div>
                        <div @click="handleRemove(item)">
                            <Icon type="ios-trash-outline"></Icon>
                            <span>删除</span>
                        </div>
                        <div @click="handleCopy(item)">
                            <Icon type="link"></Icon>
                            <span>链接</span>
                        </div>
                    </div>

                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload ref="upload" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" action="http://localhost:3001/store/file" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="View Image" v-model="visible">
            <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
    </div>

</template>
<script>
export default {
    props: {
        imageList: {
            type: Array,
            default: function () {
                return [{
                    'name': 'a42bdcc1178e62b4694c830f028db5c0',
                    'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                },
                {
                    'name': 'bc7521e033abdd1e92222d733590f104',
                    'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                }];
            } },
        uploadList: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data () {
        return {
            imgUrl: '',
            visible: false
        };
    },
    methods: {

        handleView (item) {
            this.imgUrl = item.url;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        // 复制链接
        handleCopy (item) {
            const self = this;
            this.$copyText(item.url).then(function (e) {
                self.$Message.info('已复制到粘贴板');
            }, function (e) {
                self.$Message.info('复制出错');
            });
        },
        handleSuccess (res, file) {
            file.url = res.url;
            file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: 'The file format is incorrect',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: 'Exceeding file size limit',
                desc: 'File  ' + file.name + ' is too large, no more than 2M.'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: 'Up to five pictures can be uploaded.'
                });
            }
            return check;
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    },
    watch: {
        uploadList: function (newValue, oldValue) {
            this.$emit('update:imageList', newValue);
        }
    }
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 160px;
  height: 100px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.demo-upload-list-cover div {
  color: #fff;
  font-size: 10px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cooperate {
  display: flex;
  bottom: 0px;
  align-items: center;
}

.cooperate div {
  padding: 2px;
}
</style>
