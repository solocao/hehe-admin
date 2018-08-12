<template>
    <div class="article-list">
        <div class="header-btn">
            <ButtonGroup class="btn-item">
                <Button size='small'>全部</Button>
                <Button size='small' type="primary">已发布</Button>
                <Button size='small'>草稿</Button>
                <Button size='small'>爬虫</Button>
            </ButtonGroup>
            <ButtonGroup class="btn-item">
                <Button size='small' @click="articleList">刷新</Button>
                <Button size='small' type="primary">清空搜索条件</Button>
                <Button size='small'>全部</Button>
                <Button size='small'>批量操作</Button>
            </ButtonGroup>
            <div class="search-item">
                <Input v-model="value" size="small" placeholder="Enter something..." style="width: 300px"></Input>
                <Button size='small'>搜索</Button>
            </div>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe ref="table2image"></Table>
        <div class="article-page">
            <Page :total="paginate.total" size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
        </div>

    </div>
</template>
<script>
import articleTitle from './articleTitle.vue'
import Title from './meta/Title.vue'
import Category from './meta/Category.vue'
import Tag from './meta/Tag.vue'
export default {
    data() {
        return {
            paginate: {
                page: 1,
                pages: 1,
                size: 10,
                total: 0
            },
            tableData1: this.mockTableData1(),
            imageName: '',
            tableColumns1: [
                {
                    title: '文章',
                    key: 'title',
                    width: 420,
                    render: (h, params) => {
                        const row = params.row;
                        return (<Title data={row} />)
                    }
                },
                {
                    title: '标签',
                    key: 'tag',
                    render: (h, params) => {
                        const tag = params.row.tag;
                        return (<Tag data={tag} />)
                    }
                },
                {
                    title: '分类',
                    key: 'category',
                    render: (h, params) => {
                        const category = params.row.category;
                        return (<Category data={category} />)
                    }
                },
                {
                    title: '状态',
                    key: 'state'
                },
                {
                    title: '操作',
                    key: 'state',
                    width: 140,
                    render: (h, params) => {
                        const row = params.row;
                        const self = this;
                        return (<div>
                            <i-button size="small" title='查看' style="margin-bottom:3px" onClick={() => this.openEdit(row._id)}>编辑文章</i-button>
                            <dropdown>
                                <i-button size="small">更多操作</i-button>
                                <dropdown-menu slot="list">
                                    <dropdown-item>
                                        <div onClick={() => self.articleDelete(row._id)} >
                                            <icon type="ios-copy"></icon>预览文章
                                        </div>
                                    </dropdown-item>
                                    <dropdown-item>
                                        <div onClick={() => self.articleDelete(row._id)} >
                                            <icon type="ios-copy"></icon>删除文章
                                        </div>
                                    </dropdown-item>
                                    <dropdown-item>
                                        <div onClick={() => self.articleDelete(row._id)} >
                                            <icon type="ios-copy"></icon>修改标签
                                        </div>
                                    </dropdown-item>
                                    <dropdown-item>
                                        <div onClick={() => self.articleDelete(row._id)} >
                                            <icon type="ios-copy"></icon>修改分类
                                        </div>
                                    </dropdown-item>
                                </dropdown-menu>
                            </dropdown>
                        </div >)
                    }
                }
            ]
        };
    },
    methods: {
        // 分页页面数
        pageChange(page) {
            this.paginate.page = page;
            this.articleList()
        },
        // 每页现实内容数目
        pageSizeChange(pageSize) {
            this.paginate.size = pageSize;
            this.articleList()
        },
        // 删除文章
        async  articleDelete(_id) {
            const params = {
                url: 'article/item/delete',
                payload: {
                    _id: _id
                },
                auth: true
            }
            const result = await this.post(params);
            if (result.code === 1) {
                this.articleList()

            }


        },
        openEdit(article_id) {
            this.$router.push({
                path: 'edit',
                query: {
                    article_id: article_id
                }
            })
        },
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
                payload: {
                    page: this.paginate.page,
                    size: this.paginate.size
                }
            }
            const result = await this.post(params)
            console.log('看看结果')
            console.log(result)
            console.log(result.data)
            this.tableData1 = result.data
            this.paginate = result.paginate

        }

    },
    mounted() {
        this.articleList()
    }
};
</script>

<style lang="less">
.article-list {
  background: white;

  .header-btn {
    margin-bottom: 4px;
    margin-top: 4px;
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 6px;
    width: 100%;
    position: relative;

    .btn-item {
      margin-right: 6px;
    }
    .search-item {
      position: absolute;
      right: 4px;
    }
  }
}

.article-page {
  padding: 6px;
  padding-right: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
