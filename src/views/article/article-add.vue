
<template>
    <div>
        <Row>
            <Col span="18">
            <Card>
                <Form :label-width="80">
                    <FormItem label="文章标题" :error="articleError">
                        <Input v-model="title" @on-blur="titleBlur" />
                    </FormItem>
                    <FormItem label="原文链接" :error="descriptionError">
                        <Input v-model="description" @on-blur="descriptionBlur" />
                    </FormItem>
                    <FormItem label="关键字" :error="keyworError">
                        <Input v-model="keyword" @on-blur="keywordBlur" />
                    </FormItem>
                    <FormItem label="文章描述" :error="descriptionError">
                        <Input v-model="description" @on-blur="descriptionBlur" />
                    </FormItem>
                    <FormItem label="文章标签" :error="articleError">
                        <Tag @click.native="avtiveTag(t)" type="dot" :color="t.active?'blue':'grey'" v-for="t in tags" :key="t.name">{{t.name}}</Tag>
                    </FormItem>
                </Form>
                <div class="margin-top-20">
                    <textarea id="articleEditor"></textarea>
                </div>
            </Card>
            </Col>
            <Col span="6" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="paper-airplane"></Icon>
                    发布
                </p>
                <p class="margin-top-10">
                    <Icon type="android-time"></Icon>&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp; 态：
                    <Select size="small" style="width:90px" value="草稿">
                        <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </p>
                <p class="margin-top-10">
                    <Icon type="eye"></Icon>&nbsp;&nbsp;公开度：&nbsp;
                    <b>{{ Openness }}</b>
                    <Button v-show="!editOpenness" size="small" @click="handleEditOpenness" type="text">修改</Button>
                    <transition name="openness-con">
                        <div v-show="editOpenness" class="openness-radio-con">
                            <RadioGroup v-model="currentOpenness" vertical>
                                <Radio label="公开">
                                    公开
                                    <Checkbox v-show="currentOpenness === '公开'" v-model="topArticle">在首页置顶这篇文章</Checkbox>
                                </Radio>
                                <Radio label="密码">
                                    密码
                                    <Input v-show="currentOpenness === '密码'" style="width:120px" size="small" placeholder="请输入密码" />
                                </Radio>
                                <Radio label="私密"></Radio>
                            </RadioGroup>
                            <div>
                                <Button type="primary" @click="handleSaveOpenness">确认</Button>
                                <Button type="ghost" @click="cancelEditOpenness">取消</Button>
                            </div>
                        </div>
                    </transition>
                </p>
                <p class="margin-top-10">
                    <Icon type="ios-calendar-outline"></Icon>&nbsp;&nbsp;
                    <span v-if="publishTimeType === 'immediately'">立即发布</span>
                    <span v-else>定时：{{ publishTime }}</span>
                    <Button v-show="!editPublishTime" size="small" @click="handleEditPublishTime" type="text">修改</Button>
                    <transition name="publish-time">
                        <div v-show="editPublishTime" class="publish-time-picker-con">
                            <div class="margin-top-10">
                                <DatePicker @on-change="setPublishTime" type="datetime" style="width:200px;" placeholder="选择日期和时间"></DatePicker>
                            </div>
                            <div class="margin-top-10">
                                <Button type="primary" @click="handleSavePublishTime">确认</Button>
                                <Button type="ghost" @click="cancelEditPublishTime">取消</Button>
                            </div>
                        </div>
                    </transition>
                </p>
                <Row class="margin-top-20 publish-button-con">
                    <span class="publish-button">
                        <Button @click="handlePreview">预览</Button>
                    </span>
                    <span class="publish-button">
                        <Button @click="handleSaveDraft">保存草稿</Button>
                    </span>
                    <span class="publish-button">
                        <Button @click="handlePublish" :loading="publishLoading" type="primary">发布</Button>
                    </span>
                </Row>
            </Card>
            <div class="margin-top-10">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        分类目录
                    </p>
                    <Tabs type="card">
                        <TabPane label="所有分类目录">
                            <div class="classification-con">
                                <Tree ref="categoryTree" :data="classificationList" @on-check-change="setClassificationInAll" show-checkbox></Tree>
                            </div>
                        </TabPane>
                        <TabPane label="常用目录">
                            <div class="classification-con">
                                <CheckboxGroup v-model="offenUsedClassSelected" @on-change="setClassificationInOffen">
                                    <p v-for="item in offenUsedClass" :key="item.title">
                                        <Checkbox :label="item.title">{{ item.title }}</Checkbox>
                                    </p>
                                </CheckboxGroup>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>

            </Col>
        </Row>
    </div>
</template>

<script>
import tinymce from 'tinymce';

export default {
    name: 'artical-publish',
    data() {
        return {
            content: '<h2>I am Example</h2>',
            editorOption: {
                // some quill options
            },
            // 标题
            title: '',
            tags: null,
            avtiveTags: null,
            activeCatogories: null,
            // 关键字
            keyword: '',
            // 描述
            description: '',
            articleError: '',
            showLink: false,
            fixedLink: '',
            articlePath: '',
            articlePathHasEdited: false,
            editLink: false,
            editPathButtonType: 'ghost',
            editPathButtonText: '编辑',
            articleStateList: [{ value: '草稿' }, { value: '等待复审' }],
            editOpenness: false,
            Openness: '公开',
            currentOpenness: '公开',
            topArticle: false,
            publishTime: '',
            publishTimeType: 'immediately',
            editPublishTime: false, // 是否正在编辑发布时间
            articleTagSelected: [], // 文章选中的标签
            articleTagList: [], // 所有标签列表
            classificationList: [],
            classificationSelected: [], // 在所有分类目录中选中的目录数组
            offenUsedClass: [],
            offenUsedClassSelected: [], // 常用目录选中的目录
            classificationFinalSelected: [], // 最后实际选择的目录
            publishLoading: false,
            addingNewTag: false, // 添加新标签
            newTagName: '' // 新建标签名
        };
    },
    methods: {
        avtiveTag(t) {
            t.active = !t.active
        },
        async categoryList() {
            const params = {
                url: 'category/list',
                payload: {}
            }
            const result = await this.post(params)
            const data = result.data
            function nodeTree(tree) {
                tree.forEach(e => {
                    e.title = e.name
                    e.expand = true
                    if (e.children === undefined) {
                        return
                    } else {
                        nodeTree(e.children)
                    }
                });
            }
            nodeTree(data)
            this.classificationList = data
        },
        async tagList() {
            const params = {
                url: '/tag/list',
                payload: {

                }
            }
            const result = await this.post(params)
            const data = result.data
            data.forEach(x => {
                x.active = false
            })

            this.tags = result.data

        },

        titleBlur() {
            if (this.title.length !== 0) {
                // this.articleError = '';
                localStorage.title = this.title; // 本地存储文章标题
                if (!this.articlePathHasEdited) {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    this.fixedLink = window.location.host + '/' + year + '/' + month + '/' + day + '/';
                    this.articlePath = this.title;
                    this.articlePathHasEdited = true;
                    this.showLink = true;
                }
            } else {
                // this.articleError = '文章标题不可为空哦';
                this.$Message.error('文章标题不可为空哦');
            }
        },
        keywordBlur() {
            if (this.keyword.length !== 0) {
                // 本地存储文章关键字
                localStorage.keyword = this.keyword;
            } else {
                // this.articleError = '文章标题不可为空哦';
                this.$Message.error('关键字不可为空哦');
            }
        },
        descriptionBlur() {
            if (this.description.length !== 0) {
                // 本地存储文章描述
                localStorage.description = this.description;
            } else {
                // this.articleError = '文章标题不可为空哦';
                this.$Message.error('文章描述不可为空哦');
            }
        },
        editArticlePath() {
            this.editLink = !this.editLink;
            this.editPathButtonType = this.editPathButtonType === 'ghost' ? 'success' : 'ghost';
            this.editPathButtonText = this.editPathButtonText === '编辑' ? '完成' : '编辑';
        },
        handleEditOpenness() {
            this.editOpenness = !this.editOpenness;
        },
        handleSaveOpenness() {
            this.Openness = this.currentOpenness;
            this.editOpenness = false;
        },
        cancelEditOpenness() {
            this.currentOpenness = this.Openness;
            this.editOpenness = false;
        },
        handleEditPublishTime() {
            this.editPublishTime = !this.editPublishTime;
        },
        handleSavePublishTime() {
            this.publishTimeType = 'timing';
            this.editPublishTime = false;
        },
        cancelEditPublishTime() {
            this.publishTimeType = 'immediately';
            this.editPublishTime = false;
        },
        setPublishTime(datetime) {
            this.publishTime = datetime;
        },
        setClassificationInAll(selectedArray) {
            this.classificationFinalSelected = selectedArray.map(item => {
                return item.title;
            });
            localStorage.classificationSelected = JSON.stringify(this.classificationFinalSelected); // 本地存储所选目录列表
        },
        setClassificationInOffen(selectedArray) {
            this.classificationFinalSelected = selectedArray;
        },
        handleAddNewTag() {
            this.addingNewTag = !this.addingNewTag;
        },
        createNewTag() {
            if (this.newTagName.length !== 0) {
                this.articleTagList.push({ value: this.newTagName });
                this.addingNewTag = false;
                setTimeout(() => {
                    this.newTagName = '';
                }, 200);
            } else {
                this.$Message.error('请输入标签名');
            }
        },
        cancelCreateNewTag() {
            this.newTagName = '';
            this.addingNewTag = false;
        },
        // 允许发布之前的权限验证
        canPublish() {
            this.avtiveTags = this.tags.filter(x => x.active === true)
            if (this.avtiveTags.length === 0) {
                this.$Message.error('请选择文章标签');
                return false
            }
            this.activeCatogories = this.$refs.categoryTree.getCheckedNodes()
            if (this.activeCatogories.length === 0) {
                this.$Message.error('请选择文章分类');
                return false
            }
            if (this.title.length === 0) {
                this.$Message.error('请输入文章标题');
                return false;
            } else {
                return true;
            }
        },
        handlePreview() {
            if (this.canPublish()) {
                if (this.publishTimeType === 'immediately') {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hour = date.getHours();
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    localStorage.publishTime = year + ' 年 ' + month + ' 月 ' + day + ' 日 -- ' + hour + ' : ' + minute + ' : ' + second;
                } else {
                    localStorage.publishTime = this.publishTime; // 本地存储发布时间
                }
                localStorage.content = tinymce.activeEditor.getContent();
                this.$router.push({
                    name: 'preview'
                });
            }
        },
        handleSaveDraft() {
            if (!this.canPublish()) {
                //
            }
        },
        async handlePublish() {
            if (this.canPublish()) {
                this.publishLoading = true;
                console.log('看看结果')
                console.log(this.avtiveTags.map(x => { return x._id }))
                const params = {
                    url: '/article/add',
                    payload: {
                        title: this.title,
                        content: this.content,
                        keyword: this.keyword,
                        description: this.description,
                        tag: JSON.stringify(this.avtiveTags.map(x => { return x._id })),
                        category: JSON.stringify(this.activeCatogories.map(x => { return x._id }))
                    },
                    auth: true
                }
                const result = await this.post(params)
                this.publishLoading = false;
                if (result.code === 1) {
                    this.$Notice.success({
                        title: '发送成功',
                        desc: '文章《' + this.title + '》保存成功',
                        duration: 3
                    });
                } else {
                    this.$Notice.success({
                        title: '发送失败',
                        desc: '请联系管理员',
                        duration: 3
                    });
                }
            }
        },
        handleSelectTag() {
            localStorage.tagsList = JSON.stringify(this.articleTagSelected); // 本地存储文章标签列表
        }
    },
    computed: {
        completeUrl() {
            let finalUrl = this.fixedLink + this.articlePath;
            localStorage.finalUrl = finalUrl; // 本地存储完整文章路径
            return finalUrl;
        }
    },
    mounted() {
        this.categoryList()
        this.tagList()
        this.articleTagList = [
            { value: 'vue' },
            { value: 'iview' },
            { value: 'ES6' },
            { value: 'webpack' },
            { value: 'babel' },
            { value: 'eslint' }
        ];
        this.classificationList = [
            {
                title: 'Vue实例',
                expand: true,
                children: [
                    {
                        title: '数据与方法',
                        expand: true
                    },
                    {
                        title: '生命周期',
                        expand: true
                    }
                ]
            },
            {
                title: 'Class与Style绑定',
                expand: true,
                children: [
                    {
                        title: '绑定HTML class',
                        expand: true,
                        children: [
                            {
                                title: '对象语法',
                                expand: true
                            },
                            {
                                title: '数组语法',
                                expand: true
                            },
                            {
                                title: '用在组件上',
                                expand: true
                            }
                        ]
                    },
                    {
                        title: '生命周期',
                        expand: true
                    }
                ]
            },
            {
                title: '模板语法',
                expand: true,
                children: [
                    {
                        title: '插值',
                        expand: true
                    },
                    {
                        title: '指令',
                        expand: true
                    },
                    {
                        title: '缩写',
                        expand: true
                    }
                ]
            }
        ];
        this.offenUsedClass = [
            {
                title: 'vue实例'
            },
            {
                title: '生命周期'
            },
            {
                title: '模板语法'
            },
            {
                title: '插值'
            },
            {
                title: '缩写'
            }
        ];
        tinymce.init({
            selector: '#articleEditor',
            branding: false,
            elementpath: false,
            height: 600,
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                'searchreplace visualblocks visualchars code fullscreen fullpage',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
            autosave_interval: '20s',
            image_advtab: true,
            table_default_styles: {
                width: '100%',
                borderCollapse: 'collapse'
            }
        });
    },
    destroyed() {
        tinymce.get('articleEditor').destroy();
    }
};
</script>
<style lang="stylus">

@import '../../styles/common.styl';
@import './article-add.styl';
</style>
