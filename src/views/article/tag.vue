<template>
  <div>
    <Row>
      <Col span="16">

      <Card>
        <p slot="title">
          <Icon type="images"></Icon>
          标签管理
        </p>

        <Table :data="tableData1" :columns="tableColumns1" stripe ref="table2image"></Table>

      </Card>

      </Col>
      <Col span="8" class="padding-left-10">

      <Card>
        <p slot="title">
          <Icon type="paper-airplane"></Icon>
          编辑
        </p>
        <p class="margin-top-10">
          <div>
            <Icon type="android-time"></Icon>标签名称:
          </div>
          <div>
            fasf
          </div>
        </p>

        <p class="margin-top-10">
          <div>
            <Icon type="android-time"></Icon>标签别名
          </div>
          <div>
            fasf
          </div>
        </p>

        <p class="margin-top-10">
          <div>
            <Icon type="android-time"></Icon>描述
          </div>
          <div>
            <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" />
          </div>
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
            <Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">发布</Button>
          </span>
        </Row>
      </Card>

      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData1: this.mockTableData1(),
      imageName: '',
      tableColumns1: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? 'blue' : row.status === 2 ? 'green' : 'red';
            const text = row.status === 1 ? '构建中' : row.status === 2 ? '构建完成' : '构建失败';

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text);
          }
        },
        {
          title: '画像内容',
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
          title: '选定人群数',
          key: 'people',
          render: (h, params) => {
            return h('Poptip', {
              props: {
                trigger: 'hover',
                title: params.row.people.length + '个客群',
                placement: 'bottom'
              }
            }, [
                h('Tag', params.row.people.length),
                h('div', {
                  slot: 'content'
                }, [
                    h('ul', this.tableData1[params.index].people.map(item => {
                      return h('li', {
                        style: {
                          textAlign: 'center',
                          padding: '4px'
                        }
                      }, item.n + '：' + item.c + '人');
                    }))
                  ])
              ]);
          }
        },
        {
          title: '取样时段',
          key: 'time',
          render: (h, params) => {
            return h('div', '近' + params.row.time + '天');
          }
        },
        {
          title: '更新时间',
          key: 'update',
          render: (h, params) => {
            return h('div', this.formatDate(this.tableData1[params.index].update));
          }
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
    }

  }
};
</script>

<style lang="stylus">
@import './tag.styl';
</style>


