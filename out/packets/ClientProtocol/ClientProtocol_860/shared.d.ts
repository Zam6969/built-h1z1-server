/// <reference types="node" />
export declare function readPacketType(data: Buffer, packets: any): {
    packetType: number;
    packet: any;
    length: number;
};
export declare function writePacketType(packetType: number): Buffer;
export declare function readUnsignedIntWith2bitLengthValue(data: Buffer, offset: number): {
    value: number;
    length: number;
};
export declare function packUnsignedIntWith2bitLengthValue(value: number): Buffer;
export declare function readSignedIntWith2bitLengthValue(data: Buffer, offset: number): {
    value: number;
    length: number;
};
export declare function packSignedIntWith2bitLengthValue(value: number): Buffer;
export declare function readPositionUpdateData(data: Buffer, offset: number): {
    value: any;
    length: number;
};
export declare function packPositionUpdateData(obj: any): Buffer;
export declare function packItemDefinitionData(obj: any): Buffer;
export declare function packItemSubData(obj: any): Buffer;
export declare function parseVehicleReferenceData(data: Buffer, offset: number): {
    value: any;
    length: number;
};
export declare function packVehicleReferenceData(obj: any): {
    data: Buffer;
    length: number;
};
export declare function parseItemAddData(data: Buffer, offset: number, referenceData: any): {
    value: {
        itemDefinition: any;
        itemData: any;
    };
    length: number;
};
export declare function parseItemData(data: Buffer, offset: number, referenceData: any): {
    value: {
        baseItem: any;
        detail: any;
    };
    length: number;
};
export declare function packItemData(obj: any, referenceData: any): void;
export declare const lightWeightPcSchema: ({
    name: string;
    type: string;
    defaultValue: string;
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    parser: typeof readUnsignedIntWith2bitLengthValue;
    packer: typeof packUnsignedIntWith2bitLengthValue;
    defaultValue: number;
} | {
    name: string;
    type: string;
    defaultValue: number;
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number[];
    parser?: undefined;
    packer?: undefined;
})[];
export declare const statDataSchema: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        types?: undefined;
    } | {
        name: string;
        type: string;
        types: {
            0: {
                name: string;
                type: string;
                defaultValue: number;
            }[];
            1: {
                name: string;
                type: string;
                defaultValue: number;
            }[];
        };
        defaultValue?: undefined;
    })[];
    defaultValue?: undefined;
})[];
export declare const lightWeightNpcSchema: ({
    name: string;
    type: string;
    defaultValue: string;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    parser: typeof readUnsignedIntWith2bitLengthValue;
    packer: typeof packUnsignedIntWith2bitLengthValue;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number[];
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: boolean;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    fields: {
        name: string;
        type: string;
        defaultValue: string;
    }[];
    parser?: undefined;
    packer?: undefined;
})[];
export declare const fullPcDataSchema: ({
    name: string;
    type: string;
    parser: typeof readUnsignedIntWith2bitLengthValue;
    packer: typeof packUnsignedIntWith2bitLengthValue;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: string;
    } | {
        name: string;
        type: string;
        defaultValue: number;
    })[];
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
})[];
export declare const fullNpcDataSchema: ({
    name: string;
    type: string;
    parser: typeof readUnsignedIntWith2bitLengthValue;
    packer: typeof packUnsignedIntWith2bitLengthValue;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: string;
    } | {
        name: string;
        type: string;
        defaultValue: number;
    })[];
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number[];
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
})[];
export declare const resourceEventDataSubSchema: ({
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: never[];
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            fields: {
                name: string;
                type: string;
                defaultValue: number;
            }[];
            defaultValue?: undefined;
        })[];
    })[];
    defaultValue?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    fields?: undefined;
})[];
export declare const rewardBundleDataSchema: ({
    name: string;
    type: string;
    defaultValue: boolean;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
    defaultValue: {
        currencyId: number;
        quantity: number;
    }[];
} | {
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: {
        name: string;
        type: string;
        types: {
            1: {
                name: string;
                type: string;
                fields: ({
                    name: string;
                    type: string;
                    defaultValue: boolean;
                } | {
                    name: string;
                    type: string;
                    defaultValue: number;
                } | {
                    name: string;
                    type: string;
                    defaultValue: string;
                })[];
            }[];
        };
    }[];
})[];
export declare const objectiveDataSchema: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: boolean;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: {
            name: string;
            type: string;
            defaultValue: number;
        }[];
        defaultValue: {
            currencyId: number;
            quantity: number;
        }[];
    } | {
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: string;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: never[];
        fields: {
            name: string;
            type: string;
            types: {
                1: {
                    name: string;
                    type: string;
                    fields: ({
                        name: string;
                        type: string;
                        defaultValue: boolean;
                    } | {
                        name: string;
                        type: string;
                        defaultValue: number;
                    } | {
                        name: string;
                        type: string;
                        defaultValue: string;
                    })[];
                }[];
            };
        }[];
    })[];
    defaultValue?: undefined;
})[];
export declare const achievementDataSchema: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            fields: ({
                name: string;
                type: string;
                defaultValue: boolean;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                fields: {
                    name: string;
                    type: string;
                    defaultValue: number;
                }[];
                defaultValue: {
                    currencyId: number;
                    quantity: number;
                }[];
            } | {
                name: string;
                type: string;
                defaultValue: number;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                defaultValue: string;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                defaultValue: never[];
                fields: {
                    name: string;
                    type: string;
                    types: {
                        1: {
                            name: string;
                            type: string;
                            fields: ({
                                name: string;
                                type: string;
                                defaultValue: boolean;
                            } | {
                                name: string;
                                type: string;
                                defaultValue: number;
                            } | {
                                name: string;
                                type: string;
                                defaultValue: string;
                            })[];
                        }[];
                    };
                }[];
            })[];
            defaultValue?: undefined;
        })[];
        defaultValue?: undefined;
    })[];
} | {
    name: string;
    type: string;
    defaultValue: boolean;
    fields?: undefined;
})[];
export declare const loadoutDataSubSchema1: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
    } | {
        name: string;
        type: string;
        defaultValue: string;
    })[];
    defaultValue?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            fields: ({
                name: string;
                type: string;
                defaultValue: number;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                defaultValue: never[];
                fields: {
                    name: string;
                    type: string;
                    defaultValue: number;
                }[];
            })[];
            defaultValue?: undefined;
        })[];
        defaultValue?: undefined;
    })[];
})[];
export declare const loadoutDataSubSchema2: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
    defaultValue?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            fields: ({
                name: string;
                type: string;
                defaultValue: number;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                defaultValue: never[];
                fields: {
                    name: string;
                    type: string;
                    defaultValue: number;
                }[];
            })[];
            defaultValue?: undefined;
        })[];
        defaultValue?: undefined;
    })[];
})[];
export declare const respawnLocationDataSchema: ({
    name: string;
    type: string;
    defaultValue: string;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number[];
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
    defaultValue?: undefined;
})[];
export declare const currencySchema: {
    name: string;
    type: string;
    defaultValue: never[];
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
};
export declare const lootItemSchema: ({
    name: string;
    type: string;
    defaultValue: never[];
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
} | {
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
    defaultValue?: undefined;
})[];
export declare const profileDataSchema: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: boolean;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
})[];
export declare const identitySchema: any;
export declare const vehicleReferenceDataSchema: ({
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
        } | {
            name: string;
            type: string;
            defaultValue: number[];
        })[];
        defaultValue?: undefined;
    })[];
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            defaultValue: never[];
            fields: {
                name: string;
                type: string;
                defaultValue: number;
            }[];
        })[];
        defaultValue?: undefined;
    })[];
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        elementType?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: never[];
        elementType: string;
    })[];
})[];
export declare const EquippedContainersSchema: {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: string;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: never[];
        fields: never[];
    } | {
        name: string;
        type: string;
        defaultValue: boolean;
        fields?: undefined;
    })[];
};
export declare const itemDataSchema: ({
    name: string;
    type: string;
    defaultValue: number;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    packer: typeof packItemSubData;
} | {
    name: string;
    type: string;
    defaultValue: boolean;
    packer?: undefined;
})[];
export declare const baseItemDefinitionSchema: ({
    name: string;
    type: string;
    defaultValue: number;
    flags?: undefined;
} | {
    name: string;
    type: string;
    flags: {
        bit: number;
        name: string;
    }[];
    defaultValue?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    flags?: undefined;
})[];
export declare const skyData: ({
    name: string;
    type: string;
    defaultValue: number;
    fixedLength?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    fixedLength?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fixedLength: number;
    defaultValue: never[];
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
})[];
export declare const profileStatsSubSchema1: ({
    name: string;
    type: string;
    defaultValue: number;
    elementType?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    elementType: string;
})[];
export declare const weaponStatsDataSubSchema1: ({
    name: string;
    type: string;
    defaultValue: number;
} | {
    name: string;
    type: string;
    defaultValue: boolean;
})[];
export declare const weaponStatsDataSchema: ({
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        elementType?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: never[];
        elementType: string;
    })[];
    defaultValue?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
    } | {
        name: string;
        type: string;
        defaultValue: boolean;
    })[];
    defaultValue?: undefined;
})[];
export declare const vehicleStatsDataSchema: ({
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        elementType?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: never[];
        elementType: string;
    })[];
} | {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
    } | {
        name: string;
        type: string;
        defaultValue: boolean;
    })[];
})[];
export declare const facilityStatsDataSchema: {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
    } | {
        name: string;
        type: string;
        defaultValue: boolean;
    })[];
}[];
export declare const itemBaseSchema: ({
    name: string;
    type: string;
    defaultValue: number;
} | {
    name: string;
    type: string;
    defaultValue: string;
})[];
export declare const effectTagDataSchema: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: string;
    } | {
        name: string;
        type: string;
        defaultValue: number[];
    })[];
    defaultValue?: undefined;
} | {
    name: string;
    type: string;
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
    defaultValue?: undefined;
})[];
export declare const targetDataSchema: {
    name: string;
    type: string;
    defaultValue: number;
}[];
export declare const itemDetailSchema: {
    name: string;
    type: string;
    defaultValue: boolean;
}[];
export declare const itemWeaponDetailSubSchema1: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            types?: undefined;
        } | {
            name: string;
            type: string;
            types: {
                0: {
                    name: string;
                    type: string;
                    defaultValue: number;
                }[];
                1: {
                    name: string;
                    type: string;
                    defaultValue: number;
                }[];
            };
            defaultValue?: undefined;
        })[];
        defaultValue?: undefined;
    })[];
    defaultValue?: undefined;
})[];
export declare const itemWeaponDetailSubSchema2: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: never[];
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            fields: ({
                name: string;
                type: string;
                defaultValue: number;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                fields: ({
                    name: string;
                    type: string;
                    defaultValue: number;
                    types?: undefined;
                } | {
                    name: string;
                    type: string;
                    types: {
                        0: {
                            name: string;
                            type: string;
                            defaultValue: number;
                        }[];
                        1: {
                            name: string;
                            type: string;
                            defaultValue: number;
                        }[];
                    };
                    defaultValue?: undefined;
                })[];
                defaultValue?: undefined;
            })[];
            defaultValue?: undefined;
        })[];
    })[];
})[];
export declare const itemWeaponDetailSchema: ({
    name: string;
    type: string;
    defaultValue: boolean;
    fields?: undefined;
} | {
    name: string;
    type: string;
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: {
            name: string;
            type: string;
            defaultValue: number;
        }[];
        defaultValue?: undefined;
    })[];
    defaultValue?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            fields: ({
                name: string;
                type: string;
                defaultValue: number;
                types?: undefined;
            } | {
                name: string;
                type: string;
                types: {
                    0: {
                        name: string;
                        type: string;
                        defaultValue: number;
                    }[];
                    1: {
                        name: string;
                        type: string;
                        defaultValue: number;
                    }[];
                };
                defaultValue?: undefined;
            })[];
            defaultValue?: undefined;
        })[];
        defaultValue?: undefined;
    })[];
} | {
    name: string;
    type: string;
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: never[];
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            defaultValue: never[];
            fields: ({
                name: string;
                type: string;
                defaultValue: number;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                fields: ({
                    name: string;
                    type: string;
                    defaultValue: number;
                    fields?: undefined;
                } | {
                    name: string;
                    type: string;
                    fields: ({
                        name: string;
                        type: string;
                        defaultValue: number;
                        types?: undefined;
                    } | {
                        name: string;
                        type: string;
                        types: {
                            0: {
                                name: string;
                                type: string;
                                defaultValue: number;
                            }[];
                            1: {
                                name: string;
                                type: string;
                                defaultValue: number;
                            }[];
                        };
                        defaultValue?: undefined;
                    })[];
                    defaultValue?: undefined;
                })[];
                defaultValue?: undefined;
            })[];
        })[];
    })[];
})[];
