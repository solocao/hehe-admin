<template>
    <div>
        <Form ref="form" :model="form" :label-width="80" :rules="ruleValidate">
            <FormItem prop="name" required="true" label="商品名称">
                <Input v-model="form.name" />
            </FormItem>
            <FormItem label="商品编码" :error="articleError">
                <Input v-model="form.code" />
            </FormItem>
            <FormItem label="商品关键字">
                <Input v-model="form.keyword" />
            </FormItem>
            <FormItem label="商品描述">
                <Input v-model="form.description" />
            </FormItem>
            <FormItem label="商品标签">
                <Tag @click.native="activeTag(t)" type="dot" :color="t.active?'blue':'grey'" v-for="t in tags" :key="t.name">{{t.name}}</Tag>
            </FormItem>
            <FormItem label="品牌">
                <Cascader :data="brandData" v-model="brandValue" style="width:300px"></Cascader>
            </FormItem>
            <FormItem label="商品图片">
                <upload-card ref="uploadCard"></upload-card>
            </FormItem>
        </Form>
        <div class="margin-top-20">
            <textarea id="articleEditor"></textarea>
        </div>
    </div>
</template>
<script>
import tinymce from 'tinymce';
import uploadCard from '../utils/uploadCard.vue';
export default {
    components: {
        uploadCard
    },
    data() {
        return {
            // 商品表单
            form: {
                // 商品名称
                name: '测试商品',
                // 商品内容
                content: 'afsafaee',
                // 商品别名
                slug: null,
                // 商品描述
                description: null,
                // 官方售价
                official_price: 1300,
                // 实际售价
                sale_price: 100,
                // 图片列表
                img_list: null,
                // 标签
                tag: [],
                // 品牌
                brand: [],
                // 关键字
                keyword: [],
                // 文章状态
                state: 1,
                // 公开状态 -1私密，0需要密码，1公开
                public: 1,
                count: 12
            },
            // 这个设定很残暴,必须要[]初始化
            brandData: [],
            tags: null,
            avtiveTags: null,
            ruleValidate: {
                name: [
                    { required: true, message: '商品名称不能为空', trigger: 'blur' }
                ],
                city: [
                    { required: true, message: 'Please select the city', trigger: 'change' }
                ]
            }
        };
    },
    methods: {
        // 验证表单数据是否填写完成
        validForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        // 激活标签
        activeTag(t) {
            t.active = !t.active
            // 给form tag 附值
            this.form.tag = JSON.stringify(this.tags.filter(x => x.active === true).map(x => { return x._id }))
            console.log(this.form.tag)
        },
        async brandList() {
            const params = {
                url: 'brand/list',
                payload: {}
            }
            const result = await this.post(params)
            const data = result.data
            function nodeTree(tree) {
                tree.forEach(e => {
                    e.value = e._id
                    e.label = e.name
                    if (e.children === undefined) {
                        return
                    } else {
                        nodeTree(e.children)
                    }
                });
            }
            nodeTree(data)
            this.brandData = data
        },
        // 获取商品tag
        async tagList() {
            const params = {
                url: '/tag/list',
                payload: {
                    type: 1
                }
            }
            const result = await this.post(params)
            const data = result.data
            data.forEach(x => {
                x.active = false
            })
            this.tags = result.data
        },
    },
    mounted() {

        this.brandList()
        this.tagList()
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
</style>


