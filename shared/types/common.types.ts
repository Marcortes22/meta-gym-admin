
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}


export interface Timestamps {
  createdAt: Date;
  updatedAt?: Date;
}
