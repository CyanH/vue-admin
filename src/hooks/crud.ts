import { ref, reactive } from 'vue'
import { ElNotification } from "element-plus";
import { initData, download } from '@/api/data'

export default function useCrud() {
  // 页码
  const page = ref(0);
  // 每页数据条数
  const size = ref(10);
  // 总数据条数
  const total = ref(0);
  // 排序规则，默认 id 降序， 支持多字段排序 ['id,desc', 'createTime,asc']
  const sort = ["id,desc"];
  // 表格数据
  const data = ref([]);
  // 请求数据的url
  const url = ref('')
  // 待查询的对象
  const query = reactive({});
  // 查询数据的参数
  const params = reactive({});
  // 等待时间
  const time = ref(50)
  // 是否为新增类型的表单
  const isAdd = ref(false)
  // 导出的 Loading
  const downloadLoading = ref(false)
  // 表格 Loading 属性
  const loading = ref(true)
  // 删除 Loading 属性
  const delLoading = ref(false)
  const delAllLoading = ref(false)
  // 弹窗属性
  const dialog = ref(false)
  // Form 表单
  const form = reactive({})
  // 重置表单
  const resetForm = reactive({})
  // 标题
  const title = ref('')

  const setUrl = (e: string) => {
    url.value = e
  }

  const init = () => {
    return new Promise((resolve, reject) => {
      loading.value = true
      // 请求数据
      initData(url.value, getQueryParame()).then((res: any) => {
        total.value = res.totalElements
        data.value = res.content
        // time 毫秒后显示表格
        setTimeout(() => {
          loading.value = false
        }, time.value)
        resolve(res)
      }).catch(err => {
        loading.value = false
        reject(err)
      })
    })
  }

  const getQueryParame = () => {
    return {
      page: page.value,
      size: size.value,
      sort,
      ...query,
      ...params
    }
  }

  // 改变页码
  const pageChange = (e: number) => {
    page.value = e - 1
    init()
  }

  // 改变每页显示数
  const sizeChange = (e: number) => {
    page.value = 0
    size.value = e
    init()
  }

  // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
  const dleChangePage = (size: number) => {
    if (size === undefined) {
      size = 1
    }
    if (data.value.length === size && page.value !== 0) {
      page.value = page.value - 1
    }
  }

  // 查询方法
  const toQuery = () => {
    page.value = 0
    init()
  }

  /**
  * 通用的提示封装
  */
  const submitSuccessNotify = () => {
    ElNotification({
      title: '提交成功',
      type: 'success',
      duration: 2500
    })
  }
  const addSuccessNotify = () => {
    ElNotification({
      title: '新增成功',
      type: 'success',
      duration: 2500
    })
  }
  const editSuccessNotify = () => {
    ElNotification({
      title: '编辑成功',
      type: 'success',
      duration: 2500
    })
  }
  const delSuccessNotify = () => {
    ElNotification({
      title: '删除成功',
      type: 'success',
      duration: 2500
    })
  }

  return {
    page,
    size,
    total,
    sort,
    data,
    loading,
    setUrl,
    init,
    pageChange,
    sizeChange,
    submitSuccessNotify,
    addSuccessNotify,
    editSuccessNotify,
    delSuccessNotify
  };
}



