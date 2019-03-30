<template>
  <div class="user">
    <Button type="primary" @click="getUsers" class="getUserBtn">查询用户</Button>
    <Table
      ref="selection"
      border
      :columns="columns1"
      :data="data1"
      @on-select="select"
      @on-select-all="select"
    ></Table>
    <div class="button">
      <Button @click="handleSelectAll(true) " type="primary">全选</Button>
      <Button @click="handleSelectAll(false)" type="warning">取消全选</Button>
      <Button @click="prev" type="dashed">上一页</Button>
      <Button @click="next" type="dashed">下一页</Button>
      <Button
        @click="deleteAll"
        class="deleteAll"
        v-if="this.data1.length!=1&&this.data1.length!=0"
        type="error"
      >多选删除</Button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { deleteUser, users } from "../../api/index.js";
export default {
  data() {
    return {
      _onOff: false,
      deleteArr: [],
      userName: null,
      phone: null,
      email: null,
      page: 1,
      limit: 10,
      arr: [],
      columns1: [
        {
          //多选框
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "userName",
          key: "userName"
        },
        {
          title: "phone",
          key: "phone",
          sortable: true //排序
        },
        {
          title: "email",
          key: "email",
          sortable: true
        },
        {
          title: "注册时间",
          key: "registerTime"
        },
        {
          title: "Action",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            let self = this;
            if (self.data1[params.index].userName != "admin") {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        self.userName = params.row.userName;
                        self.phone = params.row.phone;
                        self.email = params.row.email;
                        self.delete({
                          userName: self.userName,
                          phone: self.phone,
                          email: self.email,
                          index: params.index
                        });
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        }
      ],
      data1: []
    };
  },
  created() {
    this.getUsers(this.page, this.limit);
  },
  methods: {
    //全选 and 反选函数
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
      // console.log(this.$refs);
    },
    //多选函数
    deleteAll() {
      // console.log(this.deleteArr);

      this.$Modal.confirm({
        title: "删除所选数据？",
        content: `
          确定删除所选数据？
        `,
        okText: "删除",
        onOk: () => {
          let data = [];
          this.$Message.loading({
            content: "正在删除",
            duration: 2
          });
          this.deleteArr.forEach((k, index) => {
            data[index] = k.email;
          });
          deleteUser(data)
            .then(res => {
              // console.log(res);
              if (res.status == "200") {
                this.getUsers(this.page, this.limit);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    select(userName) {
      this.deleteArr = userName;
    },
    //请求数据库用户信息函数
    getUsers(page, limit) {
      this.data1 = [];
      let param = `type=search&limit=${limit}&page=${page}`;
      users(param)
        .then(res => {
          // console.log(res.data)
          if (res.data.length == "0") {
            page--;
            this._onOff = true;
            this.getUsers(page, limit);
            alert("已经是最后一页了");
          }
          // console.log(this.page);
          res.data.forEach((k, index) => {
            if (k.userName == "admin") {
              k._disabled = true;
            }
            this.data1.push(k);
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //单个删除函数
    delete(userInfo) {
      // console.log(userInfo)
      this.$Modal.confirm({
        title: "删除以下数据？",
        content: `
          userName：&nbsp${userInfo.userName}</br></br>
          &nbsp&nbsp&nbsp
          phone：&nbsp&nbsp&nbsp${userInfo.phone}</br></br>
          &nbsp&nbsp&nbsp&nbsp
          email：&nbsp&nbsp&nbsp${userInfo.email}
        `,
        okText: "删除",
        onOk: () => {
          let onOff = false;
          this.$Message.loading({
            content: "正在删除",
            duration: 2
          });
          let data = {
            userName: userInfo.userName,
            phone: userInfo.phone,
            email: userInfo.email
          };
          deleteUser(data)
            .then(res => {
              if (res.status == 200) {
                onOff = true;
                if (onOff) {
                  this.getUsers(this.page, this.limit);
                }
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    //上一页用户按钮函数
    prev() {
      if (this.page == 1) {
        alert("这已经是第一页了！");
        return false;
      }
      if (this._onOff) {
        this.page = this.page - 2;
        this._onOff = false;
      } else {
        this.page--;
      }

      if (this.page <= 1) {
        this.page = 1;
        // return;
      }
      this.getUsers(this.page, this.limit);
      console.log(this.page);
    },
    //下一页用户按钮函数
    next() {
      this.page++;
      this.getUsers(this.page, this.limit);
      console.log(this.page);
    }
  },
  beforeRouteEnter (to, from, next) {
    if(sessionStorage.user){
      next()
    }else{
      next('./login')
    }
  }
};
</script>

<style>
.user {
  padding: 10px;
  height: 100%;
}
.button .deleteAll {
  position: absolute;
  right: -5%;
  margin-right: 100px;
}
.button {
  position: relative;
  padding-top: 5px;
  width: 100%;
}
.getUserBtn {
  margin: 5px 5px 5px;
}
</style>