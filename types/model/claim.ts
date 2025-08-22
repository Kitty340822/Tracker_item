
    export interface ClaimItem {
    id?: number;
    company: string ;
    model: string ;
    serial_number: string;
    status_id: number;
    action: string;
    time: string;
    date: string;
  }
  // สำหรับตอนเพิ่ม (ยังไม่มี id)
export type ClaimItemCreate = Omit<ClaimItem, 'id'> & { id?: number };

// สำหรับตอนแก้ไข (ต้องมี id)
export type ClaimItemUpdate = ClaimItem;
  