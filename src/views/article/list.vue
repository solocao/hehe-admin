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
                <Button size='small'>刷新</Button>
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

    </div>
</template>
<script>
import articleTitle from './articleTitle.vue'
import util from '../../libs/util.js'
import Title from './Title.vue'
export default {
    data() {
        return {
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
                    title: '日期',
                    key: 'create_at',
                    render: (h, params) => {
                        return h('span', util.timeS(params.row.create_at))
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
                        return (<div>
                            <i-button size="small" title='查看' style="margin-bottom:3px" onClick={this.openEdit}>编辑文章</i-button>
                            <dropdown>
                                <i-button size="small">更多操作</i-button>
                                <dropdown-menu slot="list">
                                    <dropdown-item><icon type="ios-copy"></icon>预x w览文章</dropdown-item>
                                    <dropdown-item><icon type="ios-download"></icon>删除文章</dropdown-item>
                                    <dropdown-item><icon type="trash-b"></icon>修改标签</dropdown-item>
                                </dropdown-menu>
                            </dropdown>
                        </div >)
                    }
                }
            ]
        };
    },
    methods: {
        openEdit() {
            this.$router.push({
                path: 'edit',
                query: {
                    article_id: '2wrqr'
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
</style>
