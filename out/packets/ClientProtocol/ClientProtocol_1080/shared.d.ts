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
export declare const profileSchema: ({
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
export declare function packItemDefinitionData(obj: any): Buffer;
export declare const vehicleReferenceSchema: ({
    name: string;
    type: string;
    defaultValue: {}[];
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
    defaultValue: {}[];
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
            defaultValue: {}[];
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
    defaultValue: {}[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        elementType?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: {}[];
        elementType: string;
    })[];
})[];
export declare function parseVehicleReferenceData(data: Buffer, offset: number): {
    value: any;
    length: number;
};
export declare function packVehicleReferenceData(obj: any): {
    data: Buffer;
    length: number;
};
export declare function packInteractionComponent(): Buffer;
export declare function packNpcComponent(): Buffer;
export declare const itemSchema: ({
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
export declare const identitySchema: ({
    name: string;
    type: string;
    defaultValue: number;
} | {
    name: string;
    type: string;
    defaultValue: string;
})[];
export declare const lightWeightPcSchema: ({
    name: string;
    type: string;
    defaultValue: string;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
    flags?: undefined;
} | {
    name: string;
    type: string;
    parser: typeof readUnsignedIntWith2bitLengthValue;
    packer: typeof packUnsignedIntWith2bitLengthValue;
    defaultValue?: undefined;
    fields?: undefined;
    flags?: undefined;
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
    parser?: undefined;
    packer?: undefined;
    flags?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
    flags?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number[];
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
    flags?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    flags: {
        bit: number;
        name: string;
        defaultValue: number;
    }[];
    parser?: undefined;
    packer?: undefined;
    fields?: undefined;
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
    defaultValue?: undefined;
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
    fields: {
        name: string;
        type: string;
        defaultValue: never[];
        flags: {
            bit: number;
            name: string;
            defaultValue: number;
        }[];
    }[];
    defaultValue: {};
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    fields: {
        name: string;
        type: string;
        defaultValue: string;
    }[];
    defaultValue: {};
    parser?: undefined;
    packer?: undefined;
})[];
export declare const effectTagsSchema: ({
    name: string;
    type: string;
    defaultValue: number;
} | {
    name: string;
    type: string;
    defaultValue: string;
})[];
export declare const statSchema: ({
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
export declare const itemWeaponDetailSubSchema2: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {}[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    } | {
        name: string;
        type: string;
        defaultValue: {}[];
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
    })[];
})[];
export declare function packItemSubData(obj: any): Buffer;
export declare function packItemWeaponData(obj: any): Buffer;
export declare const currencySchema: {
    name: string;
    type: string;
    defaultValue: number;
}[];
export declare const rewardBundleSchema: ({
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
export declare const collectionsSchema: ({
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
        defaultValue: string;
        fields?: undefined;
    })[];
    defaultValue?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {}[];
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
            defaultValue: boolean;
        })[];
        defaultValue?: undefined;
    })[];
})[];
export declare const objectiveSchema: ({
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
        defaultValue: string;
        fields?: undefined;
    })[];
    defaultValue?: undefined;
})[];
export declare const achievementSchema: ({
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
    defaultValue: {}[];
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
                defaultValue: string;
                fields?: undefined;
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
export declare const characterResourceData: ({
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
} | {
    name: string;
    type: string;
    defaultValue: string;
    fields?: undefined;
})[];
export declare const attachmentSchema: ({
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
    defaultValue: never[];
    fields: {
        name: string;
        type: string;
        defaultValue: number;
    }[];
} | {
    name: string;
    type: string;
    defaultValue: boolean;
    fields?: undefined;
})[];
export declare const remoteWeaponSchema: ({
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
        defaultValue: {};
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
                defaultValue: {};
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
            })[];
        })[];
    })[];
})[];
export declare const remoteWeaponExtraSchema: ({
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
    } | {
        name: string;
        type: string;
        defaultValue: boolean;
    })[];
})[];
export declare const fullNpcSchema: ({
    name: string;
    type: string;
    parser: typeof readUnsignedIntWith2bitLengthValue;
    packer: typeof packUnsignedIntWith2bitLengthValue;
    defaultValue?: undefined;
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
        fields?: undefined;
    } | {
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
    } | {
        name: string;
        type: string;
        defaultValue: boolean;
        fields?: undefined;
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
    defaultValue: never[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
    } | {
        name: string;
        type: string;
        defaultValue: string;
    })[];
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
    } | {
        name: string;
        type: string;
        defaultValue: string;
    })[];
    parser?: undefined;
    packer?: undefined;
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
    packer: typeof packTargetData;
    parser?: undefined;
    defaultValue?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    fields: {
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
            defaultValue: {};
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
            } | {
                name: string;
                type: string;
                defaultValue: string;
                fields?: undefined;
            })[];
        })[];
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
        defaultValue: never[];
        fields: ({
            name: string;
            type: string;
            defaultValue: string;
            fields?: undefined;
        } | {
            name: string;
            type: string;
            defaultValue: {};
            fields: ({
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
                defaultValue: {};
                fields: ({
                    name: string;
                    type: string;
                    defaultValue: string;
                } | {
                    name: string;
                    type: string;
                    defaultValue: number;
                })[];
            } | {
                name: string;
                type: string;
                defaultValue: {};
                fields: ({
                    name: string;
                    type: string;
                    defaultValue: string;
                } | {
                    name: string;
                    type: string;
                    defaultValue: number[];
                })[];
            })[];
        } | {
            name: string;
            type: string;
            defaultValue: never[];
            fields: ({
                name: string;
                type: string;
                defaultValue: string;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                defaultValue: {};
                fields: ({
                    name: string;
                    type: string;
                    defaultValue: string;
                } | {
                    name: string;
                    type: string;
                    defaultValue: number;
                })[];
            })[];
        })[];
    }[];
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    fields: ({
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
                defaultValue: {};
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
                        defaultValue: {};
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
                    })[];
                })[];
            })[];
        } | {
            name: string;
            type: string;
            defaultValue: string;
        })[];
    } | {
        name: string;
        type: string;
        defaultValue: {};
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
            } | {
                name: string;
                type: string;
                defaultValue: boolean;
            })[];
        } | {
            name: string;
            type: string;
            defaultValue: string;
        })[];
    })[];
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    fields: ({
        name: string;
        type: string;
        defaultValue: never[];
        fields: ({
            name: string;
            type: string;
            defaultValue: {};
            fields: ({
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
        } | {
            name: string;
            type: string;
            defaultValue: boolean;
            fields?: undefined;
        })[];
    } | {
        name: string;
        type: string;
        defaultValue: number;
        fields?: undefined;
    })[];
    parser?: undefined;
    packer?: undefined;
})[];
export declare const fullPcSchema: ({
    name: string;
    type: string;
    defaultValue: boolean;
    fields?: undefined;
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    fields: ({
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
            fields?: undefined;
        } | {
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
        } | {
            name: string;
            type: string;
            defaultValue: boolean;
            fields?: undefined;
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
        defaultValue: never[];
        fields: ({
            name: string;
            type: string;
            defaultValue: number;
        } | {
            name: string;
            type: string;
            defaultValue: string;
        })[];
        parser?: undefined;
        packer?: undefined;
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
            defaultValue: never[];
            fields: ({
                name: string;
                type: string;
                defaultValue: number;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                defaultValue: {};
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
                } | {
                    name: string;
                    type: string;
                    defaultValue: string;
                    fields?: undefined;
                })[];
            })[];
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
            defaultValue: never[];
            fields: ({
                name: string;
                type: string;
                defaultValue: string;
                fields?: undefined;
            } | {
                name: string;
                type: string;
                defaultValue: {};
                fields: ({
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
                    defaultValue: {};
                    fields: ({
                        name: string;
                        type: string;
                        defaultValue: string;
                    } | {
                        name: string;
                        type: string;
                        defaultValue: number;
                    })[];
                } | {
                    name: string;
                    type: string;
                    defaultValue: {};
                    fields: ({
                        name: string;
                        type: string;
                        defaultValue: string;
                    } | {
                        name: string;
                        type: string;
                        defaultValue: number[];
                    })[];
                })[];
            } | {
                name: string;
                type: string;
                defaultValue: never[];
                fields: ({
                    name: string;
                    type: string;
                    defaultValue: string;
                    fields?: undefined;
                } | {
                    name: string;
                    type: string;
                    defaultValue: {};
                    fields: ({
                        name: string;
                        type: string;
                        defaultValue: string;
                    } | {
                        name: string;
                        type: string;
                        defaultValue: number;
                    })[];
                })[];
            })[];
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
                    defaultValue: {};
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
                            defaultValue: {};
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
                        })[];
                    })[];
                })[];
            } | {
                name: string;
                type: string;
                defaultValue: string;
            })[];
        }[];
        parser?: undefined;
        packer?: undefined;
    })[];
    defaultValue?: undefined;
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    parser: typeof readPositionUpdateData;
    packer: typeof packPositionUpdateData;
    defaultValue?: undefined;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: string;
    fields?: undefined;
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: never[];
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
    parser?: undefined;
    packer?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
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
        } | {
            name: string;
            type: string;
            defaultValue: boolean;
        })[];
    } | {
        name: string;
        type: string;
        defaultValue: string;
    })[];
    parser?: undefined;
    packer?: undefined;
})[];
export declare const respawnLocationSchema: ({
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
export declare const containerData: ({
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
        defaultValue?: undefined;
    })[];
} | {
    name: string;
    type: string;
    defaultValue: boolean;
    fields?: undefined;
})[];
export declare const containers: ({
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    fields: ({
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
            defaultValue?: undefined;
        })[];
    } | {
        name: string;
        type: string;
        defaultValue: boolean;
        fields?: undefined;
    })[];
})[];
export declare const skyData: ({
    name: string;
    type: string;
    defaultValue: number;
} | {
    name: string;
    type: string;
    defaultValue: string;
})[];
export declare const recipeData: ({
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
    defaultValue: {}[];
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
    } | {
        name: string;
        type: string;
        defaultValue: string;
    })[];
})[];
export declare const equipmentCharacterSchema: ({
    name: string;
    type: string;
    defaultValue: number;
} | {
    name: string;
    type: string;
    defaultValue: string;
})[];
export declare const equipmentSlotSchema: ({
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
})[];
export declare const itemDefinitionSchema: any[];
export declare const loadoutSlotData: ({
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
})[];
export declare const loadoutSlotsSchema: ({
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
                defaultValue: string;
            })[];
            defaultValue?: undefined;
        })[];
    }[];
    defaultValue?: undefined;
})[];
export declare const firemodesSchema: {
    name: string;
    type: string;
    defaultValue: number;
}[];
export declare function packTargetData(obj: any): Buffer;
export declare const passengerSchema: ({
    name: string;
    type: string;
    defaultValue: string;
    fields?: undefined;
} | {
    name: string;
    type: string;
    defaultValue: {};
    fields: ({
        name: string;
        type: string;
        defaultValue: number;
    } | {
        name: string;
        type: string;
        defaultValue: string;
    })[];
} | {
    name: string;
    type: string;
    defaultValue: number;
    fields?: undefined;
})[];
