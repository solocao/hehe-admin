<template>
    <div style="background:white">
        <article-title></article-title>
        <div style="marginBottom:4px;marginTop:4px">
            <ButtonGroup>
                <!-- <article-title></article-title> -->

                <Button size='small'>全部</Button>
                <Button size='small' type="primary">已发布</Button>
                <Button size='small'>全部</Button>
                <Button size='small'>全部</Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button size='small'>刷新</Button>
                <Button size='small' type="primary">清空搜索条件</Button>
                <Button size='small'>全部</Button>
                <Button size='small'>批量操作</Button>
            </ButtonGroup>
        </div>

        <Table :data="tableData1" :columns="tableColumns1" stripe ref="table2image"></Table>

    </div>
</template>
<script>
import articleTitle from './articleTitle.vue'
export default {
    components: {
        articleTitle
    },
    data() {
        return {
            tableData1: this.mockTableData1(),
            imageName: '',
            tableColumns1: [
                {
                    title: '评论',
                    key: 'comment',
                    render: (h, params) => {
                        return (<div>
                            asfa
                            <dropdown>
                                <i-button size="small">操作</i-button>
                                <dropdown-menu slot="list">
                                    <dropdown-item><icon type="ios-copy"></icon>数据下载</dropdown-item>
                                    <dropdown-item><icon type="ios-download"></icon>视频下载</dropdown-item>
                                    <dropdown-item><icon type="trash-b"></icon>关闭任务</dropdown-item>
                                </dropdown-menu>
                            </dropdown>
                        </div >)
                    }
                },
                {
                    title: '文章',
                    key: 'title',
                    width: 200,
                    render: (h, params) => {
                        const row = params.row;
                        console.log(row.title)
                        const text = row.title
                        return h('div', {
                            style: {
                                padding: '4px',
                                height: '60px',
                                width: '500px',
                                backgroundSize: 'cover'
                            }
                        }, [h('img', {
                            domProps: {
                                src: 'http://www.qiye.gov.cn/e/data/images/notimg.gif'
                            },
                            style: {
                                width: '64px',
                                height: '48px'
                            }
                        }), text]);
                    }
                },
                {
                    title: '分类目录',
                    key: 'category'
                },
                {
                    title: '标签',
                    key: 'portrayal',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                title: params.row.portrayal.length + '个画像',
                                placement: 'bottom'
                            }
                        }, [
                                h('Tag', params.row.portrayal.length),
                                h('div', {
                                    slot: 'content'
                                }, [
                                        h('ul', this.tableData1[params.index].portrayal.map(item => {
                                            return h('li', {
                                                style: {
                                                    textAlign: 'center',
                                                    padding: '4px'
                                                }
                                            }, item);
                                        }))
                                    ])
                            ]);
                    }
                },
                {
                    title: '标签',
                    key: 'tag',

                },
                {
                    title: '评论',
                    key: 'comment',
                },
                {
                    title: '喜欢',
                    key: 'update'
                },
                {
                    title: '日期',
                    key: 'create_at'
                },
                {
                    title: '状态',
                    key: 'state'
                },
                {
                    title: '操作',
                    key: 'state',
                    render: (h, params) => {
                        return (<div>
                            <i-button size="small" title='查看'>编辑文章</i-button>
                            <dropdown>
                                <i-button size="small">更多操作</i-button>
                                <dropdown-menu slot="list">
                                    <dropdown-item><icon type="ios-copy"></icon>查看文章</dropdown-item>
                                    <dropdown-item><icon type="ios-download"></icon>删除文章</dropdown-item>
                                    <dropdown-item><icon type="trash-b"></icon>修改标签</dropdown-item>
                                </dropdown-menu>
                            </dropdown>
                        </div >)
                    }
                    // render: (h, params) => {


                    //     return h('div', {
                    //         style: {
                    //             display: 'flex',
                    //             flexDirection: 'column'
                    //         }
                    //     },
                    //         [
                    //             h('Button', {
                    //                 props: {
                    //                     type: 'primary',
                    //                     size: 'small'
                    //                 },
                    //                 style: {
                    //                     margin: '1px'

                    //                 },
                    //                 on: {
                    //                     click: () => {
                    //                         this.show(params.index)
                    //                     }
                    //                 }
                    //             }, '查看文章'),
                    //             h('Dropdown', {
                    //                 props: {
                    //                     transfer: true
                    //                 }
                    //             }, [
                    //                     h('Button', {
                    //                         props: {
                    //                             type: 'ghost',
                    //                             size: 'small'
                    //                         }
                    //                     }, '更多操作'),
                    //                     h('DropdownMenu', {
                    //                         slot: 'list'
                    //                     }, [
                    //                             h('DropdownItem', '查看文章'),
                    //                             h('DropdownItem', '删除文章'),
                    //                             h('DropdownItem', '详情')
                    //                         ])
                    //                 ])
                    //         ]);
                    // }
                }
            ]
        };
    },
    methods: {
        mockTableData1() {
            let data = [];
            for (let i = 0; i < 10; i++) {
                data.push({
                    name: '商圈' + Math.floor(Math.random() * 100 + 1),
                    status: Math.floor(Math.random() * 3 + 1),
                    portrayal: ['城市渗透', '人群迁移', '消费指数', '生活指数', '娱乐指数'],
                    people: [
                        {
                            n: '客群' + Math.floor(Math.random() * 100 + 1),
                            c: Math.floor(Math.random() * 1000000 + 100000)
                        },
                        {
                            n: '客群' + Math.floor(Math.random() * 100 + 1),
                            c: Math.floor(Math.random() * 1000000 + 100000)
                        },
                        {
                            n: '客群' + Math.floor(Math.random() * 100 + 1),
                            c: Math.floor(Math.random() * 1000000 + 100000)
                        }
                    ],
                    time: Math.floor(Math.random() * 7 + 1),
                    update: new Date()
                });
            }
            return data;
        },
        formatDate(date) {
            const y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d;
        },
        // 打开文章预览
        openPreview(id) {
            this.$router.push({
                name: 'preview',
                params: {
                    id: id,
                }
            })
        },
        async articleList() {
            const params = {
                url: 'article/list',
                payload: {}
            }
            const result = await this.post(params)
            console.log('看看结果')
            console.log(result)
            console.log(result.data)
            this.tableData1 = result.data

        }

    },
    mounted() {
        this.articleList()
    }
};
</script>

